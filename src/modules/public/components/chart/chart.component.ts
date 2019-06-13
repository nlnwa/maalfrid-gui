import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AggregateText} from '../../../shared/models';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {WorkerService} from '../../../explore/services';
import {Granularity, isSame} from '../../../shared/func';
import colorMaps from '../../../explore/components/chart/colors';
import {format} from 'date-fns';
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

  mergedData$ = combineLatest([this.data$, this.granularity$])
    .pipe(
      map(([data, granularity]) => this.mergeByGranularity(data, granularity)),
      map((data) => data.map(({name, series}) => {
          return ({
            name: format(new Date(name), timeFormat(this.granularity.value), {locale}),
            series: Object.entries(series)
              .map(([code, value]) => ({name: code, value: (<string[]>value).length}))
              .sort((a, b) => a.name < b.name ? -1 : a.name === b.name ? 0 : 1)
          });
        }
      ))
    );

  constructor(private workerService: WorkerService) {
    this.colorMap = this.defaultMap;
    this.customColors = Object.keys(this.colorMap).map((name) => ({name, value: this.colorMap[name]}));
  }


  onChangeGranularity(granularity) {
    this.granularity.next(granularity);
  }

  // merge data entries based on granularity (hour, day, week, etc..)
  private mergeByGranularity(data: any[], granularity: Granularity): any[] {
    if (data.length === 0) {
      return data;
    }
    return data.reduce((acc, curr) => {
      const prev = acc[acc.length - 1];
      if (prev !== undefined && isSame[granularity](new Date(prev.name), new Date(curr.name))) {
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
