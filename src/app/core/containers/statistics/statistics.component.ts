import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {BehaviorSubject, combineLatest, of, Subject} from 'rxjs';
import {catchError, distinctUntilChanged, exhaustMap, filter, map, share, switchMap, tap, withLatestFrom} from 'rxjs/operators';

import {MaalfridService} from '../../services/maalfrid-service/maalfrid.service';
import {Entity, Seed} from '../../models/config.model';
import {Interval} from '../../components/interval/interval.component';
import {AggregateText, Filter, FilterSet} from '../../models/maalfrid.model';
import {dominate, predicateFromFilters} from '../../func/filter';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  private entities = new BehaviorSubject<Entity[]>([]);
  entities$ = this.entities.asObservable();

  private seeds = new Subject<Seed[]>();
  seeds$ = this.seeds.asObservable();

  granularity = new Subject<string>();
  granularity$ = this.granularity.asObservable();

  interval = new Subject<Interval>();
  interval$ = this.interval.asObservable();

  selectedEntity = new Subject<Entity>();
  selectedEntity$ = this.selectedEntity.asObservable();

  selectedSeed = new BehaviorSubject<Seed>(null);
  selectedSeed$ = this.selectedSeed.asObservable().pipe(
    tap((seed) => this.loadFilterSets(seed)),
    share()
  );

  private text = new Subject<string>();
  text$ = this.text.asObservable();

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  globalFilters = new Subject<Filter[]>();
  globalFilters$ = this.globalFilters.asObservable();

  seedFilters = new Subject<Filter[]>();
  seedFilters$ = this.seedFilters.asObservable();

  immediateFilters = new Subject<Filter[]>();
  immediateFilters$ = this.immediateFilters.asObservable();

  private globalFilterSet = new Subject<FilterSet>();
  globalFilterSet$ = this.globalFilterSet.asObservable();

  filterSet = new Subject<FilterSet>();
  filterSet$ = this.filterSet.asObservable();

  private filterSets = new Subject<FilterSet[]>();
  filterSets$ = this.filterSets.asObservable();

  filters$ = combineLatest(this.globalFilters$, this.seedFilters$, this.immediateFilters$).pipe(
    map((_) => this.mergeFilters(_)),
    share(),
    distinctUntilChanged(),
  );

  data = new Subject<AggregateText[]>();
  data$ = this.data.asObservable().pipe(share());

  filteredData = new Subject<AggregateText[]>();
  filteredData$ = this.filteredData.asObservable().pipe(share());

  domain$ = this.data$.pipe(map((data) => dominate(data)));

  constructor(private maalfridService: MaalfridService, private cdr: ChangeDetectorRef) {
    // load seeds when entity is selected
    this.selectedEntity$.pipe(switchMap((entity) => this.maalfridService.getSeedsOfEntity(entity)))
      .subscribe(seeds => this.seeds.next(seeds));

    // when filters are changed
    this.filters$.pipe(
      // we take latest data
      withLatestFrom(this.data$),
      // but only if not loading and we got data
      filter(([_, data]) => !this.loading.value && data.length > 0),
      // filter data
      map(([filters, data]) => data.filter(predicateFromFilters(filters))),
    ).subscribe((data) => {
      // schedule update in a microtask (or else change deteection sometimes fails)
      Promise.resolve().then(() => this.filteredData.next(data));
    });

    // when data length is 0 simply update filtered data with data
    this.data$.pipe(
      filter((data) => data.length === 0)
    ).subscribe((data) => {
      // schedule update in a microtask (or else change deteection sometimes fails)
      Promise.resolve().then(() => this.filteredData.next(data));
    });

    // load data when a seed is selected or interval is set
    combineLatest(this.selectedSeed$, this.interval$).pipe(
      tap(([seed, _]) => this.loading.next(!!seed)),
      exhaustMap(([seed, interval]) => this.maalfridService.getExecutions(seed, interval)),
      tap(() => this.loading.next(false)),
    ).subscribe((data) => this.data.next(data));
  }

  ngOnInit(): void {
    this.loadEntities();
    this.loadGlobalFilter();
  }

  onFilterSave(filterSet: FilterSet) {
    this.maalfridService.saveFilter(filterSet).subscribe();
  }

  onSeedFilterReset() {
    this.loadFilterSets(this.selectedSeed.value);
  }

  onGlobalFilterReset() {
    this.loadGlobalFilter();
  }

  onRequestText(text: AggregateText) {
    this.maalfridService.getText(text.warcId)
      .pipe(
        catchError(() => of(''))
      )
      .subscribe(t => this.text.next(t));
  }

  private mergeFilters([globalFilters, seedFilters, immediateFilters]): Filter[] {
    return [...globalFilters, ...seedFilters, ...immediateFilters] as Filter[];
  }

  private loadFilterSets(seed: Seed) {
    this.maalfridService.getFilterSets(seed).subscribe(_ => this.filterSets.next(_));
  }

  private loadGlobalFilter(): void {
    this.maalfridService.getFilterById('global').subscribe(_ => this.globalFilterSet.next(_));
  }

  private loadEntities(): void {
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
    });
  }
}
