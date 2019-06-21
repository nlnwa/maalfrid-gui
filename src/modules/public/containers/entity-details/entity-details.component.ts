import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {WorkerService} from '../../../explore/services';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {AggregateText, Entity, LanguageComposition, SeedStatistic, TextCount} from '../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {MaalfridService} from '../../../core/services';
import {distinctUntilChanged, map, share, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {groupBy} from '../../../shared/func';
import {getYear, isSameMonth} from 'date-fns';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss'],
  providers: [WorkerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<void>;

  entities: Entity[];

  selectedEntityId = new BehaviorSubject<string>('');
  selectedEntityId$: Observable<string>;

  private month: Subject<Date>;
  month$: Observable<Date>;

  year$: Observable<number>;

  entityName$: Observable<string>;

  data$: Observable<AggregateText[]>;

  seedStats$: Observable<SeedStatistic[]>;

  language$: Observable<LanguageComposition>;

  textCount$: Observable<TextCount>;

  print = false;


  constructor(private maalfridService: MaalfridService,
              private router: Router,
              private route: ActivatedRoute) {

    this.ngUnsubscribe = new Subject();

    this.month = new Subject<Date>();
    this.month$ = this.month.asObservable().pipe(
      startWith(new Date())
    );

    this.year$ = of(getYear(new Date()));

    this.entities = this.route.snapshot.data.entities;

    this.selectedEntityId$ = this.selectedEntityId.asObservable().pipe(
      distinctUntilChanged(),
      share()
    );

    this.entityName$ = this.selectedEntityId.pipe(
      map((entityId: string) => {
          const found = this.entities.find(entity => entity.id === entityId);
          return found ? found.meta.name : '';
        }
      )
    );

    const seeds$ = this.selectedEntityId$.pipe(
      switchMap((entityId) => this.maalfridService.getSeedsOfEntity(entityId)),
      share()
    );

    this.data$ = combineLatest([this.year$, this.selectedEntityId$]).pipe(
      switchMap(([year, entityId]) => this.maalfridService.getStatistics(year, entityId)),
      share()
    );

    const statsPerMonth$ = combineLatest([this.month$, this.data$]).pipe(
      map(([month, data]: [Date, any]) => {
        return data.filter(row => isSameMonth(new Date(row.endTime), month));
      }),
      share()
    );

    this.textCount$ = statsPerMonth$.pipe(
      map(stats => {
        const nnLongCount =
          stats.reduce((acc, curr) => acc + (curr.statistic.NNO ? curr.statistic.NNO.total - curr.statistic.NNO.short : 0), 0);
        const nnShortCount =
          stats.reduce((acc, curr) => acc + (curr.statistic.NNO ? curr.statistic.NNO.short : 0), 0);
        const nbShortCount =
          stats.reduce((acc, curr) => acc + (curr.statistic.NOB ? curr.statistic.NOB.short : 0), 0);
        const nbLongCount =
          stats.reduce((acc, curr) => acc + (curr.statistic.NOB ? curr.statistic.NOB.total - curr.statistic.NOB.short : 0), 0);
        return {nnLongCount, nnShortCount, nbLongCount, nbShortCount};
      }),
      share()
    );

    this.seedStats$ = combineLatest([statsPerMonth$, seeds$]).pipe(
      map(([stats, seeds]) => [groupBy(stats, 'seedId'), seeds]),
      map(([statsBySeed, seeds]) => seeds.map(seed => {
        if (!statsBySeed[seed.id]) {
          return {uri: seed.meta.name, nbPercentage: 0, nnPercentage: 0};
        }
        const nobTotal = statsBySeed[seed.id].reduce((total, curr) => curr.statistic.NOB ? curr.statistic.NOB.total : 0, 0);
        const nnoTotal = statsBySeed[seed.id].reduce((total, curr) => curr.statistic.NNO ? curr.statistic.NNO.total : 0, 0);
        return {
          uri: seed.meta.name,
          nbPercentage: nobTotal / (nobTotal + nnoTotal),
          nnPercentage: nnoTotal / (nobTotal + nnoTotal),
        };
      }))
    );

    this.language$ = this.textCount$.pipe(
      map((perMonth: any) => {
        const nbTotal = perMonth.nbShortCount + perMonth.nbLongCount;
        const nnTotal = +perMonth.nnShortCount + perMonth.nnLongCount;
        const total = nbTotal + nnTotal;
        const nbPercentage = nbTotal / total;
        const nnPercentage = nnTotal / total;
        return {nbPercentage, nnPercentage};
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelectEntity(entity: Entity) {
    this.router.navigate([], {queryParams: {id: entity.id}, relativeTo: this.route})
      .catch(error => console.error(error));
  }

  onSelectMonth(month: Date) {
    this.month.next(month);
  }

  redirect(): void {
    this.router.navigate(['..'], {relativeTo: this.route.root});
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
        this.selectedEntityId.next(id);
      }
      if (print === 'true') {
        this.print = true;
      }
    });
  }
}
