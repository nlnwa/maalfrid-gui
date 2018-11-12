import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {catchError, exhaustMap, filter, map, share, tap} from 'rxjs/operators';

import {MaalfridService} from '../../services/maalfrid-service/maalfrid.service';
import {Entity, Seed} from '../../models/config.model';
import {Interval} from '../../components/interval/interval.component';
import {AggregateText, Filter, FilterSet} from '../../models/maalfrid.model';
import {dominate, predicatesFromFilters} from '../../func/filter';
import {and} from '../../func';

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

  private filters = new Subject<Filter[]>();
  filters$ = this.filters.asObservable();

  private filterSets = new Subject<FilterSet[]>();
  filterSets$ = this.filterSets.asObservable();

  private filterSet = new Subject<FilterSet>();
  filterSet$ = this.filterSet.asObservable();

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

  }

  ngOnInit(): void {
    this.loadEntities();
  }

  onFilterChange(_filter: object) {
    if (_filter === null) {
      // bypass filter if null
      this.filteredData.next(this.data.value);
    } else {
      // convert filter to predicates
      const predicates = predicatesFromFilters(_filter);
      // filter data by combining predicates
      this.filteredData.next(this.data.value.filter(and(predicates)));
    }
  }

  onFilterSetSelect(filterSet: FilterSet) {
    if (filterSet) {
      this.filters.next(filterSet.filters);
    } else {
      this.filters.next([]);
    }
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
    this.maalfridService.getFilterSets(seed).subscribe((filters) => this.filterSets.next(filters));
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

  private loadEntities() {
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
    });
  }

}
