import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {WorkerService} from '../../../explore/services';
import {BehaviorSubject, combineLatest, from, Observable, of, Subject} from 'rxjs';
import {AggregateText, Entity, LanguageComposition, Seed, SeedStatistic, TextCount} from '../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {MaalfridService} from '../../../core/services';
import {map, mergeMap, share, switchMap, tap} from 'rxjs/operators';
import {groupBy} from '../../../shared/func';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss'],
  providers: [WorkerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityDetailsComponent implements OnInit {

  private entities = new BehaviorSubject<Entity[]>([]);

  entities$: Observable<Entity[]>;

  selectedEntity = new Subject<Entity>();
  selectedEntity$: Observable<Entity>;

  month: Subject<Date>;
  month$: Observable<Date>;

  entityName$: Observable<string>;

  data$: Observable<AggregateText[]>;

  seeds$: Observable<Seed[]>;

  seedstats$: Observable<SeedStatistic[]>;

  language$: Observable<LanguageComposition>;

  textCount$: Observable<TextCount>;

  constructor(private maalfridService: MaalfridService,
              private router: Router,
              private route: ActivatedRoute) {
    this.month$ = of(new Date(2019, 0, 1));

    this.selectedEntity$ = this.selectedEntity.asObservable().pipe(share());

    this.entityName$ = this.selectedEntity.pipe(
      map((entity: Entity) => entity ? entity.meta.name : '')
    );

    this.seeds$ = this.selectedEntity$.pipe(
      switchMap((entity) => this.maalfridService.getSeedsOfEntity(entity))
    );

    const noname$ = combineLatest([this.month$, this.selectedEntity$]).pipe(
      switchMap(([month, entity]: [Date, Entity]) => this.maalfridService.getStatisticsForMonth(month, entity.id)),
      tap(console.log),
      share()
    );

    this.textCount$ = noname$.pipe(
      map(stats => {
        console.log(stats);
        const nnLongCount = stats.reduce((acc, curr) => acc + curr.statistic.NNO ? curr.statistic.NNO.total - curr.statistic.NNO.short : 0, 0);
        const nnShortCount = stats.reduce((acc, curr) => acc + curr.statistic.NNO ? curr.statistic.NNO.short : 0, 0);
        const nbShortCount = stats.reduce((acc, curr) => acc + curr.statistic.NOB ? curr.statistic.NOB.short : 0, 0);
        const nbLongCount = stats.reduce((acc, curr) => acc + curr.statistic.NOB ? curr.statistic.NOB.total - curr.statistic.NOB.short : 0, 0);
        return {nnLongCount, nnShortCount, nbLongCount, nbShortCount};
      })
    );

    this.seedstats$ = combineLatest([noname$, this.seeds$]).pipe(
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


    this.data$ = this.seeds$.pipe(
      switchMap(seeds =>
        from(seeds).pipe(
          mergeMap(seed => this.maalfridService.getExecutions(seed))
        )
      ),
    );

    this.language$ = this.seedstats$.pipe(
      map((seedStatistics: SeedStatistic[]) => {
        const total = seedStatistics.length;
        const nbPercentage = seedStatistics.reduce((acc, curr) => curr.nbPercentage + acc, 0) / total;
        const nnPercentage = seedStatistics.reduce((acc, curr) => curr.nnPercentage + acc, 0) / total;
        return {nbPercentage, nnPercentage};
      })
    );

    this.textCount$ = new Subject();

    this.entities$ = this.entities.asObservable();
  }

  ngOnInit() {
    this.loadEntities();
  }

  onSelectEntity(entity: Entity) {
    this.selectedEntity.next(entity);
  }

  redirect(): void {
    this.router.navigate(['../public'], {relativeTo: this.route});
  }

  private loadEntities(): void {
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
    });
  }
}
