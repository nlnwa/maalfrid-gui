import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {BehaviorSubject, combineLatest, forkJoin, Observable, of, Subject} from 'rxjs';
import {catchError, exhaustMap, filter, map, share, take, tap} from 'rxjs/operators';

import {MaalfridService} from '../../services/maalfrid-service/maalfrid.service';
import {Entity, Seed} from '../../../shared/models/config.model';
import {Interval} from '../../components/interval/interval.component';
import {AggregateText, FilterSet} from '../../../shared/models/maalfrid.model';
import {dominate, predicatesFromFilters} from '../../func/filter';
import {and} from '../../func';
import * as moment from 'moment';

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

  private selectedSeed = new BehaviorSubject<Seed>(null);
  selectedSeed$ = this.selectedSeed.asObservable();

  private text = new Subject<string>();
  text$ = this.text.asObservable();

  loading = new Subject<boolean>();
  loading$ = this.loading.asObservable().pipe();

  private filter = new Subject<FilterSet>();
  filter$ = this.filter.asObservable();

  private data = new BehaviorSubject<AggregateText[]>([]);
  private domain = new Subject<object>();
  private filteredData = new Subject<AggregateText[]>();

  domain$ = this.domain.pipe(map((data) => dominate(data)));

  filteredData$ = this.filteredData.pipe(share());

  seedAndInterval$ = combineLatest(this.selectedSeed$, this.interval$).pipe(share());

  fulfillment$ = this.seedAndInterval$.pipe(filter(([seed, interval]) => this.isFulfilled([seed, interval])));

  reset$ = this.seedAndInterval$.pipe(filter(_ => !this.isFulfilled(_)));


  loadDataAndFilter$ = this.fulfillment$.pipe(
    tap(() => this.loading.next(true)),
    exhaustMap(([seed, interval]) => forkJoin(
      this.maalfridService.getFilterBySeedId(seed.id).pipe(take(1)),
      this.fetchData(seed, interval).pipe(
        take(1),
        tap((_) => this.domain.next(_)),
      ),
    )),
    tap(() => this.loading.next(false)),
  );


  constructor(private maalfridService: MaalfridService) {
    this.loadDataAndFilter$.subscribe(([seedFilter, data]) => {
      this.data.next(data);
      if (seedFilter[0]) {
        this.filter.next(seedFilter[0]);
        this.onFilterChange(seedFilter[0]);
      } else {
        this.onFilterChange(null);
      }
    });

    // reset when preconditions is not fulfilled
    this.reset$.subscribe(_ => {
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

  onFilterSave(_: object) {
    const seed = this.selectedSeed.value;
    const filterSet: FilterSet = {seedId: seed.id, value: []};
    this.maalfridService.saveFilter(filterSet).subscribe();
  }

  onRequestText(warcId: string) {
    this.maalfridService.getText(warcId)
      .pipe(
        catchError(() => of(''))
      )
      .subscribe(_ => this.text.next(_));
  }

  onAllTextClick({code}) {
    // TODO
  }

  onShortTextClick({code}) {
    // TODO
  }

  onLongTextClick({code}) {
    // TODO
  }

  onPerExecutionTextClick({code, time}) {
    // TODO
  }

  onEntitySelect(entity: Entity) {
    if (entity) {
      this.maalfridService.getSeeds(entity).subscribe(seeds => this.seeds.next(seeds));
    } else {
      this.seeds.next([]);
    }
  }

  onSeedSelect(seed: Seed) {
    this.selectedSeed.next(seed);
  }

  onIntervalChange(interval: Interval) {
    this.interval.next(interval);
  }

  onGranularityChange(granularity: string) {
    this.granularity.next(granularity);
  }

  private isFulfilled = ([seed, interval]) => seed && moment.isMoment(interval.start) && moment.isMoment(interval.end);

  private fetchData(seed: Seed, interval: Interval): Observable<AggregateText[]> {
    return this.maalfridService.getExecutions(seed, interval);
  }

  private loadEntities() {
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
    });
  }

}
