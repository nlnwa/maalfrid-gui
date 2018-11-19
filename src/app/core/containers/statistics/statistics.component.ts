import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {combineLatest, of, Subject} from 'rxjs';
import {catchError, filter, map, share, switchMap, tap} from 'rxjs/operators';

import {MaalfridService} from '../../services/maalfrid-service/maalfrid.service';
import {Entity, Seed} from '../../models/config.model';
import {Interval} from '../../components/interval/interval.component';
import {Filter, FilterSet} from '../../models/maalfrid.model';
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

  granularity = new Subject<string>();
  granularity$ = this.granularity.asObservable();

  interval = new Subject<Interval>();
  interval$ = this.interval.asObservable();

  private selectedSeed = new Subject<Seed>();
  selectedSeed$ = this.selectedSeed.asObservable().pipe(share());

  private text = new Subject<string>();
  text$ = this.text.asObservable();

  loading = new Subject<boolean>();
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

  filters$ = combineLatest(
    this.globalFilters$.pipe(),
    this.seedFilters$.pipe(),
    this.immediateFilters$.pipe()
  ).pipe(
    map(([globalFilters, seedFilters, immediateFilters]) => [...globalFilters, ...seedFilters, ...immediateFilters])
  );

  data$ = combineLatest(this.selectedSeed$, this.interval$).pipe(
    filter(([seed, _]) => !!seed),
    tap(() => this.loading.next(true)),
    switchMap(([seed, interval]) => this.maalfridService.getExecutions(seed, interval)),
    share(),
    tap(() => this.loading.next(false)),
  );

  domain$ = this.data$.pipe(map((data) => dominate(data)));

  filteredData$ = combineLatest(this.data$, this.filters$).pipe(
    map(([data, filters]) => data.filter(predicateFromFilters(filters))),
    share(),
    tap(() => setTimeout(() => this.cdr.markForCheck()))
  );

  constructor(private maalfridService: MaalfridService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    /*
        // reset when no seed is selected
        this.selectedSeed$.pipe(
          filter((seed) => !seed)
        ).subscribe(_ => {
          this.domain.next(null);
          // this.data.next([]);
        });
    */
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
    });
    this.maalfridService.getFilterById('global').subscribe(_ => this.globalFilterSet.next(_));
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

  onFilterSetSelect(filterSet: FilterSet) {
    this.filterSet.next(filterSet);
  }

  onEntitySelect(entity: Entity) {
    this.maalfridService.getSeeds(entity).subscribe(seeds => this.seeds.next(seeds));
  }

  onSeedSelect(seed: Seed) {
    this.selectedSeed.next(seed);
    this.maalfridService.getFilterSets(seed).subscribe((filterSets) => this.filterSets.next(filterSets));
  }
}
