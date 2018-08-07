import {ChangeDetectionStrategy, Component} from '@angular/core';

import {BehaviorSubject, combineLatest, from, merge, Observable, of, Subject} from 'rxjs';
import {bufferWhen, catchError, filter, finalize, flatMap, map, mergeMap, share, shareReplay, switchMap, tap} from 'rxjs/operators';

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
  private seeds = new Subject<Seed[]>();
  private interval = new Subject<Interval>();
  private granularity = new Subject<string>();
  private text = new Subject<string>();
  private data = new BehaviorSubject<AggregateText[]>([]);
  private filter = new Subject<any>();
  private filteredData = new Subject<AggregateText[]>();
  private job: CrawlJob;

  loading = false;

  granularity$ = this.granularity.asObservable();
  text$ = this.text.asObservable();

  domain$ = this.data.pipe(
    map((data) => dominate(data)),
    tap(() => {
      // set filter to default values
      this.filter.next({language: ['NOB', 'NNO']});
    })
  );

  filteredData$ = this.filteredData.pipe(
    share(),
  );

  entity$ = this.entity.asObservable();
  seeds$ = this.seeds.asObservable();
  interval$ = this.interval.asObservable();
  seedsAndInterval$ = combineLatest(this.seeds$, this.interval$).pipe(
    shareReplay(1),
  );

  reset$ = this.seedsAndInterval$.pipe(
    filter(([seeds, interval]) => !this.isFulfilled(seeds, interval)),
    map(_ => []),
  );

  fulfillment$ = this.seedsAndInterval$.pipe(
    filter(([seeds, interval]) => this.isFulfilled(seeds, interval)),
    tap(() => this.loading = true),
    switchMap(([seeds, interval]) => this.fetchData(seeds, interval)),
    tap(() => this.loading = false),
  );

  filter$ = this.filter.pipe(
    tap((_) => this.onFilterChange(_))
  );

  constructor(private maalfridService: MaalfridService) {
    // fetch data when preconditions is fulfilled
    merge(this.fulfillment$, this.reset$).subscribe(_ => this.data.next(_));
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
        this.maalfridService.getExecutions({
          seed_id: seed.id,
          job_id: this.job ? this.job.id : '',
          start_time: interval.start
            .startOf('day')
            .toJSON(),
          end_time: interval.end
            .startOf('day')
            .toJSON(),
        })),
      finalize(() => complete.next()),
      flatMap(_ => _),
      bufferWhen(() => complete$),
    );
  }
}
