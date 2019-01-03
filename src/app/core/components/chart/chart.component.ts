import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatButtonToggleChange} from '@angular/material';
import colorMaps from './colors';
import * as moment from 'moment';
import {AggregateText} from '../../models/maalfrid.model';
import {WorkerService} from '../../services/worker.service';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {map, share, switchMap, tap, withLatestFrom} from 'rxjs/operators';

function timeFormat(granularity: Granularity): string {
  switch (granularity) {
    // case Granularity.HOUR:
    //  return 'DD.MM [kl.] HH:mm';
    case Granularity.DAY:
      return 'DD.MM.YY';
    case Granularity.WEEK:
      return '[uke] w';
    case Granularity.MONTH:
      return 'MMM YYYY';
    case  Granularity.YEAR:
      return 'YYYY';
  }
}

enum Granularity {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorkerService]
})
export class ChartComponent {
  readonly Granularity = Granularity;

  unitLanguageMap = {
    [Granularity.DAY]: 'dag',
    [Granularity.WEEK]: 'uke',
    [Granularity.MONTH]: 'måned',
    [Granularity.YEAR]: 'år',
  };

  defaultMap = colorMaps['maalfrid'];

  colorMap;
  customColors;

  chartType = 'area-chart-stacked';

  visible = true;

  @Input()
  set data(data: AggregateText[]) {
    this._data.next(data || []);
  }

  granularity = new BehaviorSubject<Granularity>(Granularity.WEEK);
  granularity$ = this.granularity.asObservable();

  _data = new Subject<AggregateText[]>();
  data$ = this._data.asObservable().pipe(
    switchMap((_) => this.workerService.transform(_)),
  );

  mergedData$ = combineLatest(this.data$, this.granularity$).pipe(
    map(([data, granularity]) => this.mergeByGranularity(data, granularity)),
    share()
  );

  perExecutionData$ = this.mergedData$.pipe(
    map((data) => data.map(({name, series}) =>
      ({
        name: moment(name).format(timeFormat(this.granularity.value)),
        series: Object.entries(series)
          .map(([code, value]) => ({name: code, value: (<string[]>value).length}))
          .sort((a, b) => a.name < b.name ? -1 : a.name === b.name ? 0 : 1)
      })))
  );

  areaData$ = this.perExecutionData$.pipe(
    map((data) => {
      if (data.length === 0) {
        return [];
      }
      const languages = data[0].series.map((entry) => entry.name);
      const result = languages.map((name) => ({name, series: []}));
      data.forEach((entry) => {
        const date = entry.name;
        entry.series.forEach(({name, value}) => {
          result.find((_) => _.name === name).series.push({name: date, value});
        });
      });
      return result;
    })
  );

  displayedColumns = ['name', 'short', 'shortPercent', 'long', 'longPercent', 'total', 'totalPercent'];

  totalData$ = this.mergedData$.pipe(
    map((mergedData) => mergedData.length > 0
      ? mergedData
        .map((_) => _.series)
        .reduce(this.mergeSeries)
      : []
    ),
    map((data) => Object.entries(data).map(([name, texts]) =>
      ({
        name,
        short: (<AggregateText[]>texts).filter(text => text.wordCount < 3500).length,
        long: (<AggregateText[]>texts).filter(text => text.wordCount >= 3500).length,
        total: (<AggregateText[]>texts).length,
      }))
    ),
    tap(_ => this.totalNrOfTexts.next(_.reduce((acc, curr) => acc + curr.total, 0))),
    share(),
  );

  totalNrOfTexts = new BehaviorSubject<number>(0);
  totalNrOfTexts$ = this.totalNrOfTexts.asObservable().pipe(share());
  totalNrOfShortTexts$ = this.totalData$.pipe(map(_ => _.reduce((acc, curr) => acc + curr.short, 0)));
  totalNrOfShortTextsPercent$ = this.totalNrOfShortTexts$.pipe(
    withLatestFrom(this.totalNrOfTexts$),
    map(([short, total]) => this.formatPercent(short, total))
  );
  totalNrOfLongTexts$ = this.totalData$.pipe(map(_ => _.reduce((acc, curr) => acc + curr.long, 0)));
  totalNrOfLongTextsPercent$ = this.totalNrOfLongTexts$.pipe(
    withLatestFrom(this.totalNrOfTexts$),
    map(([long, total]) => this.formatPercent(long, total))
  );

  constructor(private workerService: WorkerService) {
    // globally set moment's locale to norwegian bokmål
    moment.locale('nb');
    this.colorMap = this.defaultMap;
    this.customColors = Object.keys(this.colorMap).map((name) => ({name, value: this.colorMap[name]}));

  }

  get showHideIcon(): string {
    return this.visible ? 'expand_less' : 'expand_more';
  }

  getPercent(nr: number): string {
    return this.formatPercent(nr, this.totalNrOfTexts.value);
  }

  formatPercent(numerator: number, denominator: number): string {
    return (((numerator / denominator) * 100) || 0).toPrecision(3) + '%';
  }

  commonName(code: string): string {
    switch (code) {
      case 'NOB':
        return 'Bokmål';
      case 'NNO':
        return 'Nynorsk';
      default:
        return code;
    }
  }

  onChangeGranularity(granularity) {
    this.granularity.next(granularity);
  }

  onToggleVisibility() {
    this.visible = !this.visible;
  }

  onChartToggle(change: MatButtonToggleChange) {
    this.chartType = change.value;
  }

  // merge data entries based on granularity (hour, day, week, etc..)
  private mergeByGranularity(data: any[], granularity: Granularity): any[] {
    if (data.length === 0) {
      return data;
    }
    return data.reduce((acc, curr) => {
      const prev = acc[acc.length - 1];
      if (prev !== undefined && moment(prev.name).isSame(moment(curr.name), granularity)) {
        prev.series = this.mergeSeries(prev.series, curr.series);
      } else {
        // push a shallow clone of current entry since line above alters data array (prev.series = ...)
        acc.push({...curr});
      }
      return acc;
    }, []);

  }

  private mergeSeries(a, b) {
    const c = {...a, ...b};
    Object.keys(a).forEach((key) => {
      if (b.hasOwnProperty(key)) {
        c[key] = a[key].concat(b[key]);
      }
    });
    return c;
  }

}
