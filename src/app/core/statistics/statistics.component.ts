import {ChangeDetectionStrategy, Component} from '@angular/core';

import {BehaviorSubject, combineLatest, forkJoin, from, Observable, of, Subject} from 'rxjs';
import {bufferWhen, catchError, exhaustMap, filter, finalize, flatMap, map, mergeMap, share, tap} from 'rxjs/operators';

import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {CrawlJob, Entity, Seed} from '../../shared/models/config.model';
import {Interval} from '../interval/interval.component';
import {AggregateText} from '../../shared/models/maalfrid.model';
import {dominate, predicatesFromFilters} from '../../shared/func/filter';
import {and} from '../../shared/func';
import * as moment from 'moment';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  private entity = new Subject<Entity>();
  private seeds = new BehaviorSubject<Seed[]>([]);
  private interval = new Subject<Interval>();
  private granularity = new Subject<string>();
  private text = new Subject<string>();
  private data = new BehaviorSubject<AggregateText[]>([]);
  private domain = new Subject<object>();
  private filter = new Subject<any>();
  private filteredData = new Subject<AggregateText[]>();
  private job: CrawlJob;

  loading = new Subject<boolean>();
  loading$ = this.loading.asObservable();

  granularity$ = this.granularity.asObservable();
  text$ = this.text.asObservable();

  domain$ = this.domain.pipe(
    map((data) => dominate(data))
  );
  filter$ = this.filter.asObservable();
  filteredData$ = this.filteredData.pipe(
    share(),
  );

  entity$ = this.entity.asObservable();
  seeds$ = this.seeds.asObservable();
  interval$ = this.interval.asObservable();
  seedsAndInterval$ = combineLatest(this.seeds$, this.interval$).pipe(
    share(),
  );

  reset$ = this.seedsAndInterval$.pipe(
    filter(([seeds, interval]) => !this.isFulfilled(seeds, interval)),
    map(_ => []),
  );

  fulfillment$ = this.seedsAndInterval$.pipe(
    filter(([seeds, interval]) => this.isFulfilled(seeds, interval)),
    tap(() => this.loading.next(true)),
    exhaustMap(([seeds, interval]) => {
      return forkJoin(
        this.fetchData(seeds, interval).pipe(
          tap((_) => this.domain.next(_)),
        ),
        this.maalfridService.getFilter(seeds));
    }),
    tap(() => this.loading.next(false)),
  );


  constructor(private maalfridService: MaalfridService) {
    // fetch data when preconditions is fulfilled
    this.fulfillment$.subscribe(([data, _]) => {
      this.data.next(data);
      this.filter.next(_['filter']);
      this.onFilterChange(_['filter']);
    });
    // reset when preconditions is not fulfilled
    this.reset$.subscribe(_ => {
      this.data.next([]);
      this.domain.next(null);
      this.filteredData.next([]);
    });
  }

  onFilterChange(_: object) {
    if (_ === null) {
      // bypass filter if null
      this.filteredData.next(this.data.value);
    } else {
      // convert filter to predicates
      const predicates = predicatesFromFilters(_);
      // filter data by combining predicates
      this.filteredData.next(this.data.value.filter(and(predicates)));
    }
  }

  onFilterSave(_: object) {
    const seeds = this.seeds.value;
    if (seeds.length > 1) {
      console.log('cannot save filter for multiple seeds');
      return;
    }
    const seed = seeds[0];
    this.maalfridService.saveFilter(seed, _).subscribe();
  }

  onGranularityChange(granularity: string) {
    this.granularity.next(granularity);
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
    this.entity.next(entity);
  }

  onSeedSelect(seeds: Seed[]) {
    this.seeds.next(seeds);
  }

  onIntervalChange(interval: Interval) {
    this.interval.next(interval);
  }

  private isFulfilled(seeds: Seed[], interval: Interval) {
    return seeds && seeds.length > 0 &&
      moment.isMoment(interval.start) &&
      moment.isMoment(interval.end);
  }

  private fetchData(seeds: Seed[], interval: Interval): Observable<AggregateText[]> {
    const complete = new Subject<void>();
    const complete$ = complete.asObservable();

    return from(seeds).pipe(
      mergeMap((seed) =>
        this.maalfridService.getExecutions(seed, interval, this.job)),
      finalize(() => complete.next()),
      flatMap(_ => _),
      bufferWhen(() => complete$),
    );
  }
}
