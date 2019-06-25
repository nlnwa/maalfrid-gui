import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {WorkerService} from '../../../explore/services';
import {BehaviorSubject, combineLatest, forkJoin, merge, Observable, of, Subject} from 'rxjs';
import {Entity, LanguageComposition, Seed, SeedStatistic, TextCount} from '../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {MaalfridService} from '../../../core/services';
import {catchError, filter, map, share, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {groupBy} from '../../../shared/func';
import {compareAsc, getYear} from 'date-fns';
import {isSameMonth} from 'date-fns/fp';


@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss'],
  providers: [WorkerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityDetailsComponent implements AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<void>;

  entities: Entity[];

  private entityId = new Subject<string>();
  entityId$: Observable<string>;

  private month: Subject<Date>;

  month$: Observable<Date>;

  year$: Observable<number>;

  entityName$: Observable<string>;

  data$: Observable<{ statistic, endTime }[]>;

  seedStats$: Observable<SeedStatistic[]>;

  language$: Observable<LanguageComposition>;

  textCount$: Observable<TextCount>;

  print = false;


  constructor(private maalfridService: MaalfridService,
              private router: Router,
              private route: ActivatedRoute) {

    this.ngUnsubscribe = new Subject();

    this.month = new Subject<Date>();

    this.year$ = of(getYear(new Date()));

    this.entities = this.route.snapshot.data.entities;

    const seed$ = new BehaviorSubject<Seed[]>([]);
    this.entityId$ = this.entityId.pipe(share());

    this.entityName$ = this.entityId$.pipe(
      map(entityId => this.entities.find(entity => entity.id === entityId)),
      map(entity => entity ? entity.meta.name : '')
    );

    this.data$ = combineLatest([this.year$, this.entityId$]).pipe(
      switchMap(([year, entityId]) =>
        forkJoin([
          this.maalfridService.getStatisticByYear(year, entityId).pipe(catchError(() => [])),
          this.maalfridService.getSeedsOfEntity(entityId).pipe(catchError(() => []),
            tap(_ => seed$.next(_))
          )
        ])
      ),
      // convert endTime to Date and sort by date
      map(([data]) => data.map(({endTime, statistic, seedId}) => ({endTime: new Date(endTime), statistic, seedId}))),
      map(data => data.sort((a, b) => compareAsc(a.endTime, b.endTime))),
      share()
    );

    this.month$ = merge(
      this.month,
      this.data$.pipe(
        filter(data => data.length > 0),
        map(data => data[data.length - 1].endTime)
      )
    );

    const dataForMonth$ = this.month$.pipe(
      withLatestFrom(this.data$),
      map(([month, data]: [Date, any[]]) => {
        const monthPredicate = isSameMonth(month);
        return data.filter(row => monthPredicate(row.endTime));
      }),
      share()
    );

    const dataForMonthPerSeed$ = dataForMonth$.pipe(
      map(data => groupBy(data, 'seedId')),
      withLatestFrom(seed$),
      map(([statsBySeedId, seeds]) => seeds.map(seed => {
          const data = statsBySeedId[seed.id];

          const uri = seed.meta.name;

          const nnLongCount = data ? data.reduce((acc, curr) =>
            acc + (curr.statistic.NNO ? curr.statistic.NNO.total - curr.statistic.NNO.short : 0), 0) : 0;

          const nnShortCount = data ? data.reduce((acc, curr) =>
            acc + (curr.statistic.NNO ? curr.statistic.NNO.short : 0), 0) : 0;

          const nbShortCount = data ? data.reduce((acc, curr) =>
            acc + (curr.statistic.NOB ? curr.statistic.NOB.short : 0), 0) : 0;

          const nbLongCount = data ? data.reduce((acc, curr) =>
            acc + (curr.statistic.NOB ? curr.statistic.NOB.total - curr.statistic.NOB.short : 0), 0) : 0;

          const nbTotalCount = nbLongCount + nbShortCount;

          const nnTotalCount = nnLongCount + nnShortCount;

          const total = nbTotalCount + nnTotalCount;

          return {uri, nnLongCount, nnShortCount, nbShortCount, nbLongCount, nbTotalCount, nnTotalCount, total};
        })
      )
    );

    this.seedStats$ = dataForMonthPerSeed$.pipe(
      map(data => data.map(datum => {
        return {
          uri: datum.uri,
          nbPercentage: datum.nbTotalCount / datum.total,
          nnPercentage: datum.nnTotalCount / datum.total
        };
      }))
    );

    this.textCount$ = dataForMonthPerSeed$.pipe(
      map((data: any[]) => ({
        nnLongCount: data.reduce((acc, curr) => acc + curr.nnLongCount, 0),
        nnShortCount: data.reduce((acc, curr) => acc + curr.nnShortCount, 0),
        nbShortCount: data.reduce((acc, curr) => acc + curr.nbShortCount, 0),
        nbLongCount: data.reduce((acc, curr) => acc + curr.nbLongCount, 0)
      })),
      share()
    );

    this.language$ = this.textCount$.pipe(
      map((textCount: TextCount) => {
        const nbTotal = textCount.nbShortCount + textCount.nbLongCount;
        const nnTotal = textCount.nnShortCount + textCount.nnLongCount;
        const total = nbTotal + nnTotal;
        return {
          nbPercentage: nbTotal / total,
          nnPercentage: nnTotal / total
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectEntity(entity: Entity) {
    this.router.navigate([], {queryParams: {id: entity.id}, relativeTo: this.route})
      .catch(console.warn);
  }

  onSelectMonth(month: Date) {
    this.month.next(month);
  }

  onPrint(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        print: true
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

  onDisplay(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        print: null
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
    this.print = false;
  }

  ngAfterViewInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(queryParamMap => {
      const id = queryParamMap.get('id');
      const print = queryParamMap.get('print');

      if (id) {
        this.entityId.next(id);
      }
      if (print === 'true') {
        this.print = true;
      }
    });
  }
}
