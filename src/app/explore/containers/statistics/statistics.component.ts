import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {BehaviorSubject, combineLatest, of, Subject} from 'rxjs';
import {catchError, delay, exhaustMap, map, share, switchMap, tap, withLatestFrom} from 'rxjs/operators';

import {MaalfridService, SnackBarService} from '../../../core/services/';
import {AggregateText, Entity, Filter, FilterSet, Seed} from '../../../shared/';
import {Interval} from '../../components/interval/interval.component';
import {dominate, predicateFromFilters} from '../../func/';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  private entities = new BehaviorSubject<Entity[]>([]);
  entities$ = this.entities.asObservable();

  selectedEntity = new Subject<Entity>();
  selectedEntity$ = this.selectedEntity.asObservable();

  seeds$ = this.selectedEntity$.pipe(
    switchMap((entity) => this.maalfridService.getSeedsOfEntity(entity))
  );

  interval = new Subject<Interval>();
  interval$ = this.interval.asObservable();

  selectedSeed = new BehaviorSubject<Seed>(null);
  selectedSeed$ = this.selectedSeed.asObservable().pipe(
    tap(seed => this.loadFilterSets(seed)),
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
    map(([g, s, i]) => [...g, ...s, ...i]),
  );

  data = new Subject<AggregateText[]>();
  data$ = combineLatest(this.selectedSeed$, this.interval$).pipe(
    tap(([seed]) => this.loading.next(!!seed)),
    exhaustMap(([seed, interval]) => this.maalfridService.getExecutions(seed, interval)),
    tap(() => this.loading.next(false)),
    share()
  );

  filteredData$ = this.filters$.pipe(
    withLatestFrom(this.data$),
    map(([filters, data]) => data.filter(predicateFromFilters(filters))),
    delay(0), // tricks to get change detection working 100% of the time
    share(),
  );

  domain$ = this.data$.pipe(map((data) => dominate(data)));

  constructor(private maalfridService: MaalfridService,
              private snackBarService: SnackBarService) {
  }

  ngOnInit(): void {
    this.loadEntities();
    this.loadGlobalFilter();
  }

  onApplyFilter(seedId: string, startTime: string, endTime: string) {
    this.maalfridService.applyFilter(seedId, startTime, endTime).subscribe();
  }

  onFilterSetDelete(filterSet: FilterSet) {
    this.maalfridService.deleteFilter(filterSet).pipe(
      switchMap(() => this.maalfridService.getFilterSetsBySeedId(filterSet.seedId)),
      tap(() => this.snackBarService.openSnackBar('Slettet'))
    ).subscribe(filterSets => this.filterSets.next(filterSets));
  }

  onFilterSetCreate() {
    if (!this.selectedSeed.value) {
      return;
    }
    const filterSet: FilterSet = {
      seedId: this.selectedSeed.value.id,
      filters: []
    };
    this.maalfridService.createFilter(filterSet).pipe(
      tap(() => this.snackBarService.openSnackBar('Opprettet')),
      switchMap(() => this.maalfridService.getFilterSetsBySeedId(filterSet.seedId))
    ).subscribe(filterSets => this.filterSets.next(filterSets));
  }

  onFilterSetSave(filterSet: FilterSet) {
    this.maalfridService.saveFilter(filterSet).pipe(
      tap(() => this.snackBarService.openSnackBar('Lagret'))
    ).subscribe();
  }

  onSeedFilterSetReset() {
    this.loadFilterSets(this.selectedSeed.value);
  }

  onGlobalFilterReset() {
    this.loadGlobalFilter();
  }

  onRequestText(text: AggregateText) {
    this.maalfridService.getText(text.warcRefersTo || text.warcId)
      .pipe(
        catchError(() => of(''))
      )
      .subscribe(t => this.text.next(t));
  }

  private loadFilterSets(seed: Seed) {
    const seedId = seed ? seed.id : '';
    return this.maalfridService.getFilterSetsBySeedId(seedId).subscribe(_ => this.filterSets.next(_));
  }

  private loadGlobalFilter(): void {
    this.maalfridService.getFilterSetById('global').subscribe(_ => this.globalFilterSet.next(_));
  }

  private loadEntities(): void {
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
    });
  }
}
