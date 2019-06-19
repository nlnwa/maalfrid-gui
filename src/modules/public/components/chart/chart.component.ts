import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Granularity, isSame} from '../../../shared/func';
import colorMaps from '../../../explore/components/chart/colors';
import {format, parse} from 'date-fns';
import * as locale from 'date-fns/locale/nb';

function timeFormat(granularity: Granularity): string {
  switch (granularity) {
    // case Granularity.HOUR:
    //  return 'DD.MM [kl.] HH:mm';
    case Granularity.DAY:
      return 'dd.MM.yy';
    case Granularity.WEEK:
      return '\'uke\' w';
    case Granularity.MONTH:
      return 'MMM yyyy';
    case  Granularity.YEAR:
      return 'yyyy';
  }
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {

  defaultMap = colorMaps['maalfrid'];

  colorMap;
  customColors;

  @Input()
  set data(data: any) {
    this._data.next(data || []);
  }

  @Output()
  month: EventEmitter<Date> = new EventEmitter<Date>();

  granularity = new BehaviorSubject<Granularity>(Granularity.MONTH);
  granularity$: Observable<Granularity>;

  _data = new Subject<any>();
  data$: Observable<any>;

  chartData$: Observable<any>;

  constructor() {
    this.colorMap = this.defaultMap;
    this.customColors = Object.keys(this.colorMap).map((name) => ({name, value: this.colorMap[name]}));

    this.granularity$ = this.granularity.asObservable();

    this.data$ = this._data.asObservable().pipe(
      map(data => data.map(datum => ({
        endTime: datum.endTime,
        statistic: Object.entries(datum.statistic)
            .map(([code, values]) => {
              return {[code]: values['total']};
            })
            .reduce((acc, curr) => Object.assign(acc, curr))
      }))),
      map(data => data.sort((a, b) => a.endTime < b.endTime ? -1 : a.endTime === b.endTime ? 0 : 1))
    );

    this.chartData$ = combineLatest([this.data$, this.granularity$])
      .pipe(
        map(([data, granularity]) => this.mergeByGranularity(data, granularity)),
        map((data) => data.map(({endTime, statistic}) => {

            return ({
              name: format(new Date(endTime), timeFormat(this.granularity.value), {locale}),
              series: Object.entries(statistic)
                .map(([name, value]) => ({name, value}))
                .sort((a, b) => a.name < b.name ? -1 : a.name === b.name ? 0 : 1)
            });
          }
        ))
      );
  }

  onSelect(event: any) {
    const series = event.series;
    const month = parse(series, 'MMM yyyy', new Date(0), {locale});
    this.month.emit(month);
  }

  // merge data entries based on granularity (hour, day, week, etc..)
  private mergeByGranularity(data: any[], granularity: Granularity): any[] {
    if (data.length === 0) {
      return data;
    }

    return data.reduce((acc, curr) => {
      const prev = acc[acc.length - 1];
      if (prev !== undefined && isSame[granularity](new Date(prev.endTime), new Date(curr.endTime))) {
        prev.statistic = this.mergeSeries(prev.statistic, curr.statistic);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }

  private mergeSeries(a, b) {
    const c = {...a, ...b};
    Object.keys(a).forEach((key) => {
      if (b.hasOwnProperty(key)) {
        c[key] = a[key] + b[key];
      }
    });
    return c;
  }
}
