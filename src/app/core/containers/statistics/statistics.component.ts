import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {catchError, exhaustMap, filter, map, share, tap} from 'rxjs/operators';

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

  private interval = new BehaviorSubject<Interval>(new Interval());
  interval$ = this.interval.asObservable();

  private selectedSeed = new BehaviorSubject<Seed>(null);
  selectedSeed$ = this.selectedSeed.asObservable().pipe(share());

  private text = new Subject<string>();
  text$ = this.text.asObservable();

  loading = new Subject<boolean>();
  loading$ = this.loading.asObservable().pipe();

  private immediateFilter = new Subject<Filter>();
  immediateFilter$ = this.immediateFilter.asObservable();

  private seedFilters = new BehaviorSubject<Filter[]>([]);
  seedFilters$ = this.seedFilters.asObservable();

  private globalFilters = new BehaviorSubject<Filter[]>([]);
  globalFilters$ = this.globalFilters.asObservable();

  private globalFilterSet = new Subject<FilterSet>();
  globalFilterSet$ = this.globalFilterSet.asObservable();

  private filterSet = new Subject<FilterSet>();
  filterSet$ = this.filterSet.asObservable();

  private filterSets = new Subject<FilterSet[]>();
  filterSets$ = this.filterSets.asObservable();

  private data = new BehaviorSubject<AggregateText[]>([]);

  private domain = new Subject<object>();
  domain$ = this.domain.pipe(map((data) => dominate(data)));

  private filteredData = new Subject<AggregateText[]>();
  filteredData$ = this.filteredData.pipe(share());

  constructor(private maalfridService: MaalfridService) {
    combineLatest(this.selectedSeed$, this.interval$).pipe(
      filter(([seed, _]) => !!seed),
      tap(() => this.loading.next(true)),
      exhaustMap(seed => {
          return this.fetchData(this.selectedSeed.value, this.interval.value).pipe(
            tap((_) => this.domain.next(_)),
          );
        }
      ),
      tap(() => this.loading.next(false)),
    ).subscribe((data) => this.data.next(data));

    // reset when no seed is selected
    this.selectedSeed$.pipe(
      filter((seed) => !seed)
    ).subscribe(_ => {
      this.data.next([]);
      this.domain.next(null);
      this.filteredData.next([]);
    });

    combineLatest(this.globalFilters$, this.seedFilters$).pipe(
      map(([globalFilters, seedFilters]) => globalFilters.concat(seedFilters))
    ).subscribe((filters: Filter[]) => {
      if (filters.length > 0) {
        this.filteredData.next(this.data.value.filter(predicateFromFilters(filters)));
      } else {
        this.filteredData.next(this.data.value);
      }
    });
  }

  ngOnInit(): void {
    this.getEntities();
    this.getGlobalFilter();
  }

  onSeedFilterSelect(filters: Filter[]) {
    this.seedFilters.next(filters);
  }

  onGlobalFilterSelect(globalFilters: Filter[]) {
    this.globalFilters.next(globalFilters);
  }

  onFilterSetSelect(filterSet: FilterSet) {
    this.filterSet.next(filterSet);
  }

  onFilter(immediateFilter: Filter) {
    const filters = this.globalFilters.value.concat(this.seedFilters.value, immediateFilter);
    this.filteredData.next(this.data.value.filter(predicateFromFilters(filters)));
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
