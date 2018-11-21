import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatButtonToggleChange} from '@angular/material';
import colorMaps from './colors';
import * as moment from 'moment';
import {AggregateText} from '../../models/maalfrid.model';
import {WorkerService} from '../../services/worker.service';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {map, share, startWith, switchMap} from 'rxjs/operators';

function timeFormat(granularity: string): string {
  switch (granularity) {
    case 'hour':
      return 'DD.MM [kl.] HH:mm';
    case 'day':
      return 'DD.MM.YY';
    case 'week':
      return '[uke] w';
    case 'month':
      return 'MMM YYYY';
    case  'year':
      return 'YYYY';
  }
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WorkerService]
})
export class ChartComponent {
  defaultMap = colorMaps['maalfrid'];

  colorMap;
  customColors;
  doughnut = false;

  @Input()
  set granularity(granularity: string) {
    this._granularity.next(granularity);
  }

  @Input()
  set data(data: AggregateText[]) {
    if (!data) {
      console.log('no data');
      this._data.next([]);
    } else {
      this._data.next(data);
    }
  }

  _granularity = new BehaviorSubject<string>('week');
  granularity$ = this._granularity.asObservable();

  _data = new Subject<AggregateText[]>();
  data$ = this._data.asObservable().pipe(
    switchMap((_) => this.workerService.transform(_)),
  );
  
  mergedData$ = combineLatest(this.data$, this.granularity$.pipe(startWith('week'))).pipe(
    map(([data, granularity]) => this.mergeByGranularity(data, granularity)),
    share()
  );

  perExecutionData$ = this.mergedData$.pipe(
    map((data) => data.map(({name, series}) =>
      ({
        name: moment(name).format(timeFormat(this._granularity.value)),
        series: Object.entries(series).map(([code, value]) => ({name: code, value: (<any[]>value).length}))
      }))),
  );

  totalData$ = this.mergedData$.pipe(
    map((mergedData) => mergedData.length > 0
      ? mergedData
        .map((_) => _.series)
        .reduce(this.mergeSeries)
      : []
    ),
    share()
  );

  allTextData$ = this.totalData$.pipe(
    map((data) => Object.entries(data).map(([name, value]) =>
      ({
        name,
        value: (<any[]>value).length
      }))),
  );

  shortTextData$ = this.totalData$.pipe(
    map((data) => Object.entries(data).map(([name, value]) =>
      ({
        name,
        value: (<any[]>value).filter((entry: AggregateText) => entry.wordCount < 3500).length
      }))),
  );

  longTextData$ = this.totalData$.pipe(
    map((data) => Object.entries(data).map(([name, value]) =>
      ({
        name,
        value: (<any[]>value).filter((entry: AggregateText) => entry.wordCount >= 3500).length
      }))),
  );

  nrOfTexts: number;
  nrOfShortTexts: number;
  nrOfLongTexts: number;

  constructor(private workerService: WorkerService) {
    // globally set moment's locale to norwegian bokmål
    moment.locale('nb');
    this.colorMap = this.defaultMap;
    this.customColors = Object.keys(this.colorMap).map((name) => ({name, value: this.colorMap[name]}));

  }

  onChartToggle(change: MatButtonToggleChange) {
    console.log('change value', change.value);
  }

  // merge data entries based on granularity (hour, day, week, etc..)
  private mergeByGranularity(data: any[], granularity: any): any[] {
    if (data.length === 0) {
      return data;
    }
    return data.reduce((acc, curr) => {
      const prev = acc[acc.length - 1];
      if (prev !== undefined && moment(prev.name).isSame(moment(curr.name), granularity)) {
        prev.series = this.mergeSeries(prev.series, curr.series);
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
        c[key] = a[key].concat(b[key]);
      }
    });
    return c;
  }

}
