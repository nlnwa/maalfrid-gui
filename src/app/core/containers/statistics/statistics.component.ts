import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {combineLatest, Observable, of, Subject} from 'rxjs';
import {catchError, filter, map, publish, refCount, share, startWith, switchMap, tap} from 'rxjs/operators';

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
  private entities = new Subject<Entity[]>();
  entities$ = this.entities.asObservable();

  private seeds = new Subject<Seed[]>();
  seeds$ = this.seeds.asObservable();

  private granularity = new Subject<string>();
  granularity$ = this.granularity.asObservable();

  private interval = new Subject<Interval>();
  interval$ = this.interval.asObservable();

  private selectedSeed = new Subject<Seed>();
  selectedSeed$ = this.selectedSeed.asObservable().pipe(share());

  private text = new Subject<string>();
  text$ = this.text.asObservable();

  loading = new Subject<boolean>();
  loading$ = this.loading.asObservable();

  private globalFilters = new Subject<Filter[]>();
  globalFilters$ = this.globalFilters.asObservable();

  private seedFilters = new Subject<Filter[]>();
  seedFilters$ = this.seedFilters.asObservable();

  private immediateFilters = new Subject<Filter[]>();
  immediateFilters$ = this.immediateFilters.asObservable();

  private globalFilterSet = new Subject<FilterSet>();
  globalFilterSet$ = this.globalFilterSet.asObservable();


  private filterSet = new Subject<FilterSet>();
  filterSet$ = this.filterSet.asObservable();

  private filterSets = new Subject<FilterSet[]>();
  filterSets$ = this.filterSets.asObservable();

  private data = new Subject<AggregateText[]>();
  data$ = this.data.asObservable();

  private domain = new Subject<object>();
  domain$ = this.domain.pipe(map((data) => dominate(data)));

  private filters$ = combineLatest(
    this.globalFilters$.pipe(startWith<Filter[]>([])),
    this.seedFilters$.pipe(startWith<Filter[]>([])),
    this.immediateFilters$.pipe(startWith<Filter[]>([]))
  ).pipe(
    map(([globalFilters, seedFilters, immediateFilters]) => this.mergeFilters(globalFilters, seedFilters, immediateFilters))
  );

  filteredData$ = combineLatest(this.data$, this.filters$).pipe(
    share(),
    map(([data, filters]) => data.filter(predicateFromFilters(filters))),
  );

  constructor(private maalfridService: MaalfridService, private cdr: ChangeDetectorRef) {
    combineLatest(this.selectedSeed$, this.interval$).pipe(
      filter(([seed, _]) => !!seed),
      tap(() => this.loading.next(true)),
      switchMap(([seed, interval]) => this.fetchData(seed, interval)),
      tap(() => this.loading.next(false)),
    ).subscribe((data) => {
      this.domain.next(data);
      this.data.next(data);
    });

    // reset when no seed is selected
    this.selectedSeed$.pipe(
      filter((seed) => !seed)
    ).subscribe(_ => {
      this.domain.next(null);
      this.data.next([]);
    });
  }

  mergeFilters(a: Filter[], b: Filter[], c: Filter[]): Filter[] {
    const filters = [...a, ...b, ...c];
    console.log('filter length', filters.length);
    return filters;
  }

  ngOnInit(): void {
    this.getEntities();
    this.getGlobalFilter();
  }

  onFilterSave(filterSet: FilterSet) {
    this.maalfridService.saveFilter(filterSet).subscribe();
  }

  onRequestText(warcId: string) {
    this.maalfridService.getText(warcId)
      .pipe(
        catchError(() => of(''))
      )
      .subscribe(_ => this.text.next(_));
  }

  onEntitySelect(entity: Entity) {
    this.maalfridService.getSeeds(entity).subscribe(seeds => this.seeds.next(seeds));
  }

  onSeedSelect(seed: Seed) {
    this.selectedSeed.next(seed);
    this.maalfridService.getFilterSets(seed).subscribe((filterSets) => this.filterSets.next(filterSets));
  }

  onFilterSetSelect(filterSet: FilterSet) {
    this.filterSet.next(filterSet);
  }

  onSeedFilterSelect(filters: Filter[]) {

    this.seedFilters.next(filters);
  }

  onGlobalFilterSelect(globalFilters: Filter[]) {
    this.globalFilters.next(globalFilters);
  }

  onImmediateFilter(immediateFilter: Filter[]) {
    this.immediateFilters.next(immediateFilter);
  }

  onIntervalChange(interval: Interval) {
    this.interval.next(interval);
  }

  onGranularityChange(granularity: string) {
    this.granularity.next(granularity);
  }

  private fetchData(seed: Seed, interval: Interval): Observable<AggregateText[]> {
    return this.maalfridService.getExecutions(seed, interval);
  }

  private getEntities() {
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
    });
  }

  private getGlobalFilter() {
    this.maalfridService.getFilterById('global').subscribe(_ => this.globalFilterSet.next(_));
  }
}
