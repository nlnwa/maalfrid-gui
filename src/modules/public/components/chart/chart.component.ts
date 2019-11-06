import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Granularity, isSame} from '../../../shared/func';
import {format} from 'date-fns';
import {nb} from 'date-fns/locale';
import {parseWithOptions} from 'date-fns/fp';
import {Statistic} from '../../../report/containers';

const timeFormatByGranularity = {
  [Granularity.MONTH]: 'MMM yyyy',
  // [Granularity.HOUR]: 'DD.MM [kl.] HH:mm',
  [Granularity.DAY]: 'dd.MM.yy',
  [Granularity.WEEK]: '\'uke\' w',
  [Granularity.YEAR]: 'yyyy'
};

const dateStringParse = {
  [Granularity.MONTH]: parseWithOptions({locale: nb})(new Date(0))('MMM yyyy'),
  [Granularity.DAY]: parseWithOptions({locale: nb})(new Date(0))('dd.MM.yy')
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {

  // tslint:disable-next-line:variable-name
  private _data = new Subject<Statistic[]>();

  @Input()
  set data(data: any) {
    this._data.next(data || []);
  }

  @Input()
  set granularity(granularity: Granularity) {
    this._granularity.next(granularity);
  }

  @Output()
  date: EventEmitter<Date> = new EventEmitter<Date>();

  chartData$: Observable<any>;

  customColors = [
    {
      name: 'NOB',
      value: '#0072B2'
    },
    {
      name: 'NNO',
      value: '#E69F00'
    }
  ];

  // tslint:disable-next-line:variable-name
  _granularity = new BehaviorSubject<Granularity>(Granularity.MONTH);
  granularity$ = this._granularity.asObservable();

  constructor() {
    Object.defineProperty(Array.prototype, 'flat', {
      value(depth = 1) {
        return this.reduce((flat, toFlatten: Array<any> & { flat: (depth: number) => any[] }) => {
          return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
      }
    });

    const ddr$ = this._data.pipe(
      map(data => data.map(({endTime, statistic}) => ({
        endTime,
        statistic: Object.entries(statistic)
          .map(([code, values]) => ({[code]: values.total}))
          .reduce((acc, curr) => Object.assign(acc, curr))
      })))
    );

    this.chartData$ = combineLatest([ddr$, this.granularity$]).pipe(
      map(([data, granularity]: [any[], Granularity]) => ({
        data: this.mergeByGranularity(data, granularity),
        granularity
      })),
      // insert empty series where no data
      // map to chart input format
      map(_ => _.data.map(({endTime, statistic}) => ({
        name: format(endTime, timeFormatByGranularity[_.granularity], {locale: nb}),
        series: Object.entries(statistic)
          .map(([name, value]) => ({name, value}))
          .sort((a, b) => a.name < b.name ? -1 : a.name === b.name ? 0 : 1)
      })))
    );
  }




  // private insertEmpty(data: any[], granularity: string) {
  //   if (data.length === 0) {
  //     return [];
  //   }
  //   const months = data.map(datum => getMonth(datum.endTime));
  //   for (let i = 0; i < 12; i++) {
  //     const found = months.find(date => date === i);
  //     const placeholderDate = data[0] ? data[0].endTime : new Date();
  //     if (!found) {
  //       data.push({endTime: setMonth(placeholderDate, i), statistic: {}});
  //     }
  //   }
  //   return data.sort((a, b) => compareAsc(a.endTime, b.endTime));
  // }

  onSelect(event: any) {
    let date;
    if (this._granularity.value === 'day') {
      date = dateStringParse[Granularity.DAY](event.series);
    }
    if (this._granularity.value === 'month') {
      date = dateStringParse[Granularity.MONTH](event.series);
    }
    this.date.emit(date);
  }


  /**
   * Merge data entries based on granularity (hour, day, week, etc..)
   *
   * @param data Data array sorted on endTime
   * @param granularity Size of time interval to merge, e.g. day, date, etc..
   */
  private mergeByGranularity(data: any[], granularity: Granularity): any[] {
    if (data.length === 0) {
      return [];
    }
    const first = data.shift();
    return data.reduce((acc, curr) => {
      const prev = acc[acc.length - 1];
      if (isSame[granularity](prev.endTime, curr.endTime)) {
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
