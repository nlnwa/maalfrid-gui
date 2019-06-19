import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Granularity, isSame} from '../../../shared/func';
import colorMaps from '../../../explore/components/chart/colors';
import {compareAsc, format, parse} from 'date-fns';
import * as locale from 'date-fns/locale/nb';

const timeFormatByGranularity = {
  [Granularity.MONTH]: 'MMM yyyy',
  // [Granularity.HOUR]: 'DD.MM [kl.] HH:mm',
  [Granularity.DAY]: 'dd.MM.yy',
  [Granularity.WEEK]: '\'uke\' w',
  [Granularity.YEAR]: 'yyyy'
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {

  private _data = new Subject<any>();

  @Input()
  set data(data: any) {
    this._data.next(data || []);
  }

  @Output()
  month: EventEmitter<Date> = new EventEmitter<Date>();

  customColors;

  chartData$: Observable<any>;

  constructor() {
    const colorMap = colorMaps['maalfrid'];
    this.customColors = Object.keys(colorMap).map((name) => ({name, value: colorMap[name]}));

    const granularity = Granularity.MONTH;

    this.chartData$ = this._data.pipe(
      map(data => data.map(({endTime, statistic}) => ({
        endTime: new Date(endTime),
        statistic: Object.entries(statistic)
          .map(([code, values]) => ({[code]: values['total']}))
          .reduce((acc, curr) => Object.assign(acc, curr))
      }))),
      // sort must happen before mergeByGranularity below
      map(data => data.sort((a, b) => compareAsc(a.endTime, b.endTime))),
      map(data => this.mergeByGranularity(data, granularity)),
      // map to chart input format
      map(data => data.map(({endTime, statistic}) => ({
        name: format(endTime, timeFormatByGranularity[granularity], {locale}),
        series: Object.entries(statistic)
          .map(([name, value]) => ({name, value}))
          .sort((a, b) => a.name < b.name ? -1 : a.name === b.name ? 0 : 1)
      })))
    );
  }

  onSelect(event: any) {
    const month = parse(event.series, 'MMM yyyy', new Date(0), {locale});
    this.month.emit(month);
  }

  /**
   * Merge data entries based on granularity (hour, day, week, etc..)
   *
   * @param data Data array sorted on endTime
   * @param granularity Size of time interval to merge, e.g. day, month, etc..
   */
  private mergeByGranularity(data: any[], granularity: Granularity): any[] {
    if (data.length === 0) {
      return [];
    }
    const first = data.shift();
    return data.reduce((acc, curr) => {
      const prev = acc[acc.length - 1];
      if (isSame[granularity](new Date(prev.endTime), new Date(curr.endTime))) {
        prev.statistic = this.mergeSeries(prev.statistic, curr.statistic);
        return acc;
      } else {
        return acc.concat(curr);
      }
    }, [first]);
  }

  private mergeSeries(a, b) {
    const c = {...a, ...b};
    Object.keys(a).forEach(key => {
      if (b.hasOwnProperty(key)) {
        c[key] = a[key] + b[key];
      }
    });
    return c;
  }
}
