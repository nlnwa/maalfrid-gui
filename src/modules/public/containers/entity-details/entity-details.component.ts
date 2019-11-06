import {AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnDestroy} from '@angular/core';
import {WorkerService} from '../../../explore/services';
import {BehaviorSubject, combineLatest, forkJoin, Observable, Subject} from 'rxjs';
import {Entity, LanguageComposition, SeedStatistic, TextCount} from '../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {MaalfridService} from '../../../core/services';
import {catchError, distinctUntilChanged, filter, map, share, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {Granularity, groupBy, isSame} from '../../../shared/func';
import {addYears, compareAsc, differenceInCalendarYears, getYear, isAfter, isBefore, subYears} from 'date-fns';
import {isSameMonth} from 'date-fns/fp';
import {Interval} from '../../../explore/components/interval/interval.component';
import {MatDatepickerInputEvent} from '@angular/material';


@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss', './entity-details-print.scss'],
  providers: [WorkerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class EntityDetailsComponent implements AfterViewInit, OnDestroy {

  private readonly PRIMARY_SEED_LABEL_KEY = 'primary-seed-id';
  private readonly ngUnsubscribe: Subject<void>;
  private readonly entityId: Subject<string>;
  private readonly seedId: Subject<string>;
  private readonly date: Subject<Date>;

  granularity: BehaviorSubject<Granularity>;

  interval: BehaviorSubject<Interval>;

  entities: Entity[];

  entityId$: Observable<string>;

  seedId$: Observable<string>;

  date$: Observable<Date>;

  year$: BehaviorSubject<number>;

  entityName$: Observable<string>;

  dataForSeedsForYear$: Observable<{ statistic, endTime, seedId }[]>;

  seedStatsYear$: Observable<SeedStatistic[]>;

  language$: Observable<LanguageComposition>;

  seedStatsMonth$: Observable<TextCount>;

  yearRange;

  startYear = 2018;

  currentYear: number = getYear(new Date());

  selectedUri$: Observable<string>;

  lastSelectedDate: Date;

  print = false;

  readonly Granularity = Granularity;

  unitLanguageMap = {
    [Granularity.DAY]: 'dag',
    [Granularity.WEEK]: 'uke',
    [Granularity.MONTH]: 'måned',
    [Granularity.YEAR]: 'år',
  };

  startView = 'year';

  intervalModel: Interval = {
    start: null,
    end: null,
  };

  constructor(private maalfridService: MaalfridService,
              private router: Router,
              private route: ActivatedRoute) {

    this.yearRange = this.getYearRange();

    this.entities = this.route.snapshot.data.entities;

    this.ngUnsubscribe = new Subject();
    this.entityId = new Subject<string>();
    this.date = new Subject<Date>();
    this.seedId = new Subject<string>();
    this.year$ = new BehaviorSubject(getYear(new Date()));

    this.granularity = new BehaviorSubject(Granularity.DAY);

    this.interval = new BehaviorSubject(this.intervalModel);

    this.seedId$ = this.seedId.asObservable().pipe(share(), tap(() => this.date.next(null)));

    this.date$ = this.date.asObservable();

    this.entityId$ = this.entityId.pipe(
      distinctUntilChanged(),
      share());

    const seed$ = this.entityId$.pipe(
      switchMap(entityId => this.maalfridService.getSeedsOfEntity(entityId).pipe(catchError(() => []))),
      share()
    );

    this.entityName$ = this.entityId$.pipe(
      map(entityId => this.entities.find(entity => entity.id === entityId)),
      map(entity => entity ? entity.meta.name : '')
    );

    const primarySeedId$ = this.entityId$.pipe(
      map(entityId => this.entities.find(entity => entity.id === entityId)),
      map(entity => entity.meta.label.find(label => label.key === this.PRIMARY_SEED_LABEL_KEY)),
      map(label => label ? label.value : ''),
      tap(seedId => {
        if (!route.snapshot.queryParamMap.get('seed_id')) {
          this.onSelectSeed(seedId);
        }
      })
    );

    const data$ = combineLatest([this.year$, this.entityId$]).pipe(
      switchMap(([year, entityId]) =>
        forkJoin([
          this.maalfridService.getStatisticByYear(year, entityId).pipe(catchError(() => []))
        ])
      ),
      // convert endTime to Date and sort by date
      map(([data]) => data.map(({endTime, statistic, seedId}) => ({endTime: new Date(endTime), statistic, seedId}))),
      map(data => data.sort((a, b) => compareAsc(a.endTime, b.endTime))),
      share()
    );

    this.dataForSeedsForYear$ = combineLatest([data$, this.seedId$, this.interval]).pipe(
      map(([data, seedId]) => data.filter(datum => datum.seedId === seedId)),
      map(datum => this.filterByDate(datum, this.interval.value))
    );

    const statsForSeedsForYear$ = combineLatest([seed$, data$]).pipe(
      map(([seeds, data]) => [seeds, groupBy(data, 'seedId')]),
      withLatestFrom(primarySeedId$),
      map(([[seeds, data], primarySeedId]) => seeds.map(seed => {
          const id = seed.id;
          const primary = primarySeedId === id;
          const uri = seed.meta.name;
          const datum = data[id];

          const nnLongCount = datum ? datum.reduce((acc, curr) =>
            acc + (curr.statistic.NNO ? curr.statistic.NNO.total - curr.statistic.NNO.short : 0), 0) : 0;

          const nnShortCount = datum ? datum.reduce((acc, curr) =>
            acc + (curr.statistic.NNO ? curr.statistic.NNO.short : 0), 0) : 0;

          const nbShortCount = datum ? datum.reduce((acc, curr) =>
            acc + (curr.statistic.NOB ? curr.statistic.NOB.short : 0), 0) : 0;

          const nbLongCount = datum ? datum.reduce((acc, curr) =>
            acc + (curr.statistic.NOB ? curr.statistic.NOB.total - curr.statistic.NOB.short : 0), 0) : 0;

          const nbTotalCount = nbLongCount + nbShortCount;

          const nnTotalCount = nnLongCount + nnShortCount;

          const total = nbTotalCount + nnTotalCount;

          return {id, primary, uri, nbTotalCount, nnTotalCount, total};
        })
      )
    );

    this.seedStatsYear$ = statsForSeedsForYear$.pipe(
      map(data => data
        .filter(datum => datum.total > 0)
        .map(datum => ({
          id: datum.id,
          primary: datum.primary,
          uri: datum.uri,
          nbPercentage: datum.nbTotalCount / datum.total,
          nnPercentage: datum.nnTotalCount / datum.total
        }))),
      share()
    );


    this.selectedUri$ = combineLatest([this.seedStatsYear$, this.seedId$]).pipe(
      map(([seedStats, seedId]) => {
        const seed = seedStats.find(datum => datum.id === seedId);
        if (seed) {
          return seed.uri;
        } else {
          return '';
        }
      }),
    );

    this.language$ = combineLatest([this.seedStatsYear$, this.seedId$]).pipe(
      map(([stats, seedId]) => {
        const found = stats.find(stat => stat.id === seedId);
        if (found) {
          return found;
        } else {
          return null;
        }
      })
    );

    const dataForSeedForMonth$ = combineLatest([this.date$, this.dataForSeedsForYear$]).pipe(
      map(([month, data]: [Date, any[]]) => {
        const monthPredicate = isSame[this.granularity.value](month);
        return data.filter(row => monthPredicate(row.endTime));
      })
    );


    const seedStatisticsForMonth$ = dataForSeedForMonth$.pipe(
      map(seed => {
        if (seed.length === 0) {
          return null;
        }

        const nnLongCount = seed.reduce((acc, curr) =>
          acc + (curr.statistic.NNO ? curr.statistic.NNO.total - curr.statistic.NNO.short : 0), 0);

        const nnShortCount = seed.reduce((acc, curr) =>
          acc + (curr.statistic.NNO ? curr.statistic.NNO.short : 0), 0);

        const nbShortCount = seed.reduce((acc, curr) =>
          acc + (curr.statistic.NOB ? curr.statistic.NOB.short : 0), 0);

        const nbLongCount = seed.reduce((acc, curr) =>
          acc + (curr.statistic.NOB ? curr.statistic.NOB.total - curr.statistic.NOB.short : 0), 0);

        const nbTotalCount = nbLongCount + nbShortCount;

        const nnTotalCount = nnLongCount + nnShortCount;

        const total = nbTotalCount + nnTotalCount;

        return {nnLongCount, nnShortCount, nbShortCount, nbLongCount, nbTotalCount, nnTotalCount, total};
      })
    );

    this.seedStatsMonth$ = seedStatisticsForMonth$.pipe(
      map((seed) => seed
        ? {
          nbShortCount: seed.nbShortCount,
          nbLongCount: seed.nbLongCount,
          nbPercentage: seed.nbTotalCount / seed.total,
          nnShortCount: seed.nnShortCount,
          nnLongCount: seed.nnLongCount,
          nnPercentage: seed.nnTotalCount / seed.total,

        }
        : null)
    );
  }

  ngAfterViewInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(queryParamMap => {
      const id = queryParamMap.get('id');
      const seedId = queryParamMap.get('seed_id');
      if (id) {
        this.entityId.next(id);
      }
      this.seedId.next(seedId);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  onSelectEntity(entity: Entity) {
    this.router.navigate([], {queryParams: {id: entity.id}, relativeTo: this.route, preserveQueryParams: false})
      .catch(console.warn);
  }

  onSelectSeed(seedId: string) {
    if (seedId) {
      this.router.navigate([], {queryParams: {seed_id: seedId}, relativeTo: this.route, queryParamsHandling: 'merge'})
        .catch(console.warn);
    }
  }

  onSelectDate(date: Date) {
    if (!this.lastSelectedDate) {
      this.lastSelectedDate = date;
      this.date.next(date);
    } else {
      if (date.getTime() !== this.lastSelectedDate.getTime()) {
        this.date.next(date);
        this.lastSelectedDate = date;
      } else {
        this.lastSelectedDate = null;
        this.date.next(null);
      }
    }
  }

  filterByDate(data: any, interval: any) {
    let res = [];

    if (interval.start == null && interval.end == null) {
      return data;
    }

    if (interval.start !== null) {
      res = data.filter( dat =>  isAfter(dat.endTime, interval.start));
    }
    if (interval.end !== null) {
      res = data.filter(dat => isBefore(dat.endTime, interval.end));
    }
    return res;
  }

  onChangeGranularity(granularity) {
    this.granularity.next(granularity);
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.intervalModel.start = event.value;
    this.interval.next(this.intervalModel);
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    this.intervalModel.end = event.value;
    this.interval.next(this.intervalModel);
  }

  onPrint(): void {
    this.print = true;
    setTimeout(_ => {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => {
        window.print();
      }, 500);
    });
  }

  @HostListener('window:afterprint')
  onafterprint() {
    this.print = false;
    setTimeout(_ => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      this.onPrint();
    }
  }

  onNextYear() {
    this.year$.next(getYear(new Date(addYears(new Date(this.year$.value, 1, 1), 1))));
  }

  onPreviousYear() {
    this.year$.next(getYear(new Date(subYears(new Date(this.year$.value, 1, 1), 1))));
  }

  onChangeYear(year: number) {
    this.year$.next(year);
  }

  private getYearRange(): number[] {
    const years = [];
    const yearsTotal = differenceInCalendarYears(new Date(this.currentYear, 1, 1), new Date(this.startYear, 1, 1));
    for (let i = 0; i <= yearsTotal; i++) {
      years.push(this.startYear + i);
    }
    return years;
  }
}
