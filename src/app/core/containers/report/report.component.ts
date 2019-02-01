import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {MaalfridService} from '../../services/maalfrid-service/maalfrid.service';
import {Entity, Seed} from '../../models/config.model';
import * as moment from 'moment';
import {groupBy} from '../../func/util';
import {map, shareReplay, tap} from 'rxjs/operators';
import {MatSort, MatTableDataSource} from '@angular/material';
import {_isNumberValue} from '@angular/cdk/coercion';
import {Title} from '@angular/platform-browser';

interface Statistic {
  endTime: string;
  entityId: string;
  executionId: string;
  jobExecutionId: string;
  seedId: string;
  statistic: any;
}

enum Period {
  Month = 12,
  Quarter = 4,
  Halfyear = 2,
  Year = 1
}

enum Selector {
  Total,
  Short,
  Long,
}

enum Filter {
  None = 'None',
  Seed = 'Seed',
  Entity = 'Entity',
  Department = 'Department',
}

function merge(data: Statistic[]) {
  const language = data.reduce((acc, curr) => {
    Object.entries(curr.statistic).forEach(([code, stat]) => {
      acc[code] = {
        total: acc[code].total + stat['total'],
        short: acc[code].short + stat['short']
      };
    });
    return acc;
  }, {'NNO': {total: 0, short: 0}, 'NOB': {total: 0, short: 0}});

  const longNNO = language.NNO.total - language.NNO.short;
  const longNOB = language.NOB.total - language.NOB.short;
  const count = language.NNO.total + language.NOB.total;

  return {
    NOB: {
      [Selector.Total]: percent(language.NOB.total, count),
      [Selector.Short]: percent(language.NOB.short, count),
      [Selector.Long]: percent(longNOB, count),
    },
    NNO: {
      [Selector.Total]: percent(language.NNO.total, count),
      [Selector.Short]: percent(language.NNO.short, count),
      [Selector.Long]: percent(longNNO, count),
    },
  };
}

function groupByPeriod(period: Period, data: Statistic[]) {
  return data.reduce((acc, curr) => {
    acc[dateIndexForPeriod(period, curr.endTime)].push(curr);
    return acc;
  }, range(period).map(() => []));
}

function groupByDepartment(byEntity: object, departmentByEntityId: object) {
  const departments: Array<any> = Array.from(new Set(Object.values(departmentByEntityId)));

  return Object.keys(byEntity).reduce((acc, entityId) => {
    acc[departmentByEntityId[entityId]][entityId] = byEntity[entityId];
    return acc;
  }, departments.reduce((a, curr) => {
    a[curr] = {};
    return a;
  }, {}));
}

function dateIndexForPeriod(period: Period, time: string) {
  switch (period) {
    case Period.Month:
      return moment(time).month();
    case Period.Quarter:
      return moment(time).quarter() - 1;
    case Period.Halfyear:
      return moment(time).quarter() < 3 ? 0 : 1;
    case Period.Year:
      return 0;
  }
}

function range(nr: number) {
  return Array(nr).fill(0).map((_, i) => '' + i);
}

function percent(numerator: number, denominator: number): number {
  return Math.round(((numerator / denominator) || 0) * 1000) / 1000;
}

function formatPercent(fraction: number): string {
  return (fraction * 100).toPrecision(3) + '%';
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent implements OnInit {
  readonly Period = Period;
  readonly Selector = Selector;
  readonly Filter = Filter;

  readonly quarters = ['1. kvartal', '2. kvartal', '3. kvartal', '4. kvartal'];
  readonly halfyears = ['1. halvår', '2. halvår'];
  readonly years = [''];
  readonly periods = {
    [Period.Month]: range(Period.Month),
    [Period.Quarter]: range(Period.Quarter),
    [Period.Halfyear]: range(Period.Halfyear),
    [Period.Year]: range(Period.Year),
  };
  readonly langs = ['NOB', 'NNO'];

  readonly norwegianPeriod = {
    [Period.Month]: 'måned',
    [Period.Quarter]: 'kvartal',
    [Period.Halfyear]: 'halvår',
    [Period.Year]: 'år',
  };

  readonly norwegianSelector = {
    [Selector.Total]: 'alle',
    [Selector.Short]: 'korte',
    [Selector.Long]: 'lange',
  };

  readonly norwegianFilter = {
    [Filter.None]: 'alt',
    [Filter.Department]: 'departementer',
    [Filter.Entity]: 'entiteter',
    [Filter.Seed]: 'nettsteder',
  };

  readonly filterTitle = {
    [Filter.None]: '',
    [Filter.Department]: 'departementer',
    [Filter.Entity]: 'entiteter',
    [Filter.Seed]: 'nettsteder',
  };
  narrow = false;
  threshold = 0.5;

  readonly stickyColumns = ['department', 'entityId', 'seedId'];

  departmentByEntityId = {};

  // for mapping id to names
  entities = new BehaviorSubject<Entity[]>([]);
  // for mapping id to names
  seeds = new BehaviorSubject<Seed[]>([]);

  period = new BehaviorSubject<Period>(Period.Year);
  period$ = this.period.asObservable().pipe();

  selector = new BehaviorSubject<Selector>(Selector.Total);
  selector$ = this.selector.asObservable();

  filter = new BehaviorSubject<Filter>(Filter.None);
  filter$ = this.filter.asObservable().pipe(
    tap(filter => this.dataSource.filter = filter === Filter.None ? '' : filter)
  );

  year = new BehaviorSubject<number>(new Date().getUTCFullYear());
  year$ = this.year.asObservable().pipe(
    tap(year => this.loadStatistics(year)),
    shareReplay(),
  );

  title$ = combineLatest(this.year$, this.selector$, this.filter$).pipe(
    map(([year, selector, filter]) => {
      return `| rapport for ${year} | ${this.norwegianSelector[selector]} tekster | ${this.filterTitle[filter]}`;
    }),
    tap(title => this.titleService.setTitle('Nasjonalbiblioteket | Målfrid ' + title))
  );

  statistics = new Subject<any>();
  statistics$ = this.statistics.asObservable().pipe(
    map((statistics) => {
      const byEntity = groupBy(statistics, 'entityId');
      const byEntityBySeed = Object.entries(byEntity).reduce((acc, [entityId, data]) => {
        acc[entityId] = groupBy(data as any[], 'seedId');
        return acc;
      }, {});
      return groupByDepartment(byEntityBySeed, this.departmentByEntityId);
    }),
  );

  periodicColumns: string[] = this.stickyColumns.map(_ => 'period_' + _);
  displayedColumns: string[] = this.stickyColumns;

  dataSource: MatTableDataSource<any>;

  periods$ = combineLatest(this.period$, this.statistics$).pipe(
    map(([period, byDepByEntBySeed]) => {
      this.dataSource.data = [];

      const periods = this.periods[period];
      const data = [];

      Object.entries(byDepByEntBySeed).forEach(([department, byEntityBySeed]) => {
        const perEntity = Object.entries(byEntityBySeed);

        perEntity.forEach(([entityId, bySeed]) => {
          const seedData = [];
          const perSeed: Array<any> = Object.entries(bySeed);
          perSeed.forEach(([seedId, entries]) => {
            seedData.push({department, entityId, seedId, data: groupByPeriod(period, entries).map(merge)});
          });
          // if current entity has more than one seed we compute a total for the entity
          if (perSeed.length > 1) {
            const totalForEntity = perSeed.reduce((acc, [seedId, entries]) => acc.concat(...entries), []);
            seedData.push({department, entityId, data: groupByPeriod(period, totalForEntity).map(merge)});
          }
          data.push(...seedData);
        });

        // if current department has more than one entity we compute a total for the department
        if (perEntity.length > 1) {
          const totalForDepartment = perEntity.reduce((acc, [entityId, seed]) => {
            Object.entries(seed).forEach(([seedId, entries]) => {
              acc.push(...(entries as any[]));
            });
            return acc;
          }, []);
          data.push({department, data: groupByPeriod(period, totalForDepartment).map(merge)});
        }
      });

      this.periodicColumns = [...this.stickyColumns.map(_ => 'period_' + _), ...periods];
      this.displayedColumns = periods.reduce((acc, curr, i) => acc.concat('NOB' + i, 'NNO' + i), [...this.stickyColumns]);
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({
          disableClear: false,
          start: 'asc',
          id: ''
        });
      }
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
      });
      return periods;
    }),
  );

  @ViewChild(MatSort) sort: MatSort;

  constructor(private maalfridService: MaalfridService,
              private titleService: Title) {
    moment.locale('nb');

    this.dataSource = new MatTableDataSource([]);
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string | number => {
      const value: any = data[sortHeaderId];

      if (sortHeaderId.startsWith('NNO') || sortHeaderId.startsWith('NOB')) {
        const index = sortHeaderId.substring(3);
        const lang = sortHeaderId.substring(0, 3);
        return data.data[index][lang][this.selector.value];
      }

      switch (sortHeaderId) {
        case 'entityId':
          return this.formatEntity(value);
        case 'seedId':
          return this.formatSeed(value);
        default:
          return _isNumberValue(value) ? Number(value) : value;
      }
    };
    this.dataSource.filterPredicate = (data: Statistic, filter: string): boolean => {
      switch (filter) {
        case Filter.Seed:
          return data.seedId !== undefined && data.entityId !== undefined;
        case Filter.Entity:
          return data.seedId === undefined ||
            this.dataSource.data
              .map((statistic: Statistic) => statistic.entityId === data.entityId)
              .filter((bool: boolean) => bool).length === 1;
        case Filter.Department:
          return data.entityId === undefined && data.seedId === undefined;
      }
    };
  }

  get narrowIcon(): string {
    return this.narrow ? 'unfold_less' : 'unfold_more';
  }

  formatPeriod(nr: string): string {
    const interval = parseInt(nr, 10);
    switch (this.period.value) {
      case Period.Month:
        return moment('' + (interval + 1), 'MM').format('MMM');
      case Period.Quarter:
        return this.quarters[interval];
      case Period.Halfyear:
        return this.halfyears[interval];
      case Period.Year:
        return this.years[interval];
      default:
        return 'udefinert';
    }
  }

  formatValue(row: any, index: number, language: string): string {
    const value = row.data[index][language][this.selector.value];
    return value === 0 ? '-' : formatPercent(value);
  }

  formatDepartment(department: string) {
    return department === 'none' ? 'Ikke tilordnet departement' : department;
  }

  formatEntity(entityId: string) {
    const found = this.entities.value.find((entity: Entity) => entity.id === entityId);
    return found === undefined ? '-' : found.meta.name;
  }

  formatSeed(seedId: string) {
    if (this.filter.value === Filter.Entity) {
      return '-';
    }
    const found = this.seeds.value.find((seed: Seed) => seed.id === seedId);
    return found === undefined ? '-' : found.meta.name;
  }

  style(row: any, index: number, lang: string): string | string[] | Set<string> | { [klass: string]: any } {
    const data = row.data[index];
    const current = data[lang][this.selector.value];
    const other = data[lang === 'NOB' ? 'NNO' : 'NOB'][this.selector.value];
    const minor = current <= other ? current : other;

    const hue = minor * (120 / this.threshold); // 0 +- reds, 120 +- greens, 240 +- blues
    const saturation = 100;
    const lightness = 50;
    const alpha = 0.6;
    const color = hue < 10 ? 'white' : 'black';
    return minor <= this.threshold && minor === current && current !== 0
      ? {'background-color': `hsl(${hue}, ${saturation}%, ${lightness}%, ${alpha})`, 'color': `${color}`}
      : current === 0 && current !== other
        ? {'background-color': 'hsl(0, 100%, 50%, 0.6)', 'color': `${color}`}
        : {};
  }

  ngOnInit() {
    this.loadEntities();
    this.loadSeeds();
  }

  onChangePeriod(period: Period) {
    this.period.next(period);
  }

  onChangeSelector(selector: Selector) {
    this.selector.next(selector);
  }

  onChangeFilter(filter: Filter) {
    this.filter.next(filter);
  }

  onToggleRowHeight() {
    this.narrow = !this.narrow;
  }

  onPreviousYear() {
    this.year.next(this.year.value - 1);
  }

  onNextYear() {
    this.year.next(this.year.value + 1);
  }

  private loadSeeds() {
    this.maalfridService.getSeeds().subscribe((seeds) => {
      this.seeds.next(seeds);
    });
  }

  private loadStatistics(year: number) {
    this.maalfridService.getStatistics(year).subscribe(statistics => {
      this.statistics.next(statistics);
    });
  }

  private loadEntities(): void {
    this.maalfridService.getEntities().subscribe(entities => {
      this.entities.next(entities);
      entities.reduce((departmentByEntityId, entity) => {
        const departmentLabel = entity.meta.label.find(label => label.key === 'departement') || {value: 'none'};
        departmentByEntityId[entity.id] = departmentLabel.value;
        return departmentByEntityId;
      }, this.departmentByEntityId);
    });
  }
}
