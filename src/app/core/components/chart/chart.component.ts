import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {chartOptions} from './charts';
import {MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material';
import {NvD3Component} from 'ng2-nvd3';
import colorMaps from './colors';
import * as moment from 'moment';
import {AggregateText} from '../../models/maalfrid.model';
import {WorkerService} from './worker.service';
import {Subject} from 'rxjs';

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
export class ChartComponent implements AfterViewInit, OnChanges {
  visible = false;
  defaultMap = colorMaps['maalfrid'];

  colorMap;
  customColors;

  @Input()
  granularity: string;

  @Input()
  data: AggregateText[];

  @Output()
  allTextElementClick = new EventEmitter();
  @Output()
  shortTextElementClick = new EventEmitter();
  @Output()
  longTextElementClick = new EventEmitter();
  @Output()
  perExecutionElementClick = new EventEmitter();

  perExecutionData = new Subject<any[]>();
  perExecutionData$ = this.perExecutionData.asObservable();
  allTextData = new Subject<any[]>();
  allTextData$ = this.allTextData.asObservable();
  shortTextData = new Subject<any[]>();
  shortTextData$ = this.shortTextData.asObservable();
  longTextData = new Subject<any[]>();
  longTextData$ = this.longTextData.asObservable();

  nrOfTexts: number;
  nrOfShortTexts: number;
  nrOfLongTexts: number;

  allTextChartOptions: any;
  shortTextChartOptions: any;
  longTextChartOptions: any;
  perExecutionChartOptions: any;

  @ViewChildren(NvD3Component) charts: QueryList<NvD3Component>;
  @ViewChild(MatButtonToggleGroup) chartToggleGroup: MatButtonToggleGroup;

  constructor(private workerService: WorkerService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.initChartOptions();
    this.colorMap = this.defaultMap;
    this.customColors = Object.keys(this.colorMap).map((name) => ({name, value: this.colorMap[name]}));
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.granularity) {
      if (this.data && Object.keys(this.data).length > 0 && this.granularity) {
        this.transformAndApply(this.data, this.granularity);
      } else {
        this.granularity = 'week';
      }
    }
    if (changes.data) {
      if (this.data && Object.keys(this.data).length > 0 && this.granularity) {
        this.transformAndApply(this.data, this.granularity);
      } else {
        this.reset();
      }
    }
  }

  ngAfterViewInit() {
    this.chartToggleGroup.change.subscribe((change: MatButtonToggleChange) => {
      this.charts.last.clearElement();
      const chartOption = this.getPerExecutionChartOptions(change.value);
      this.charts.last.options = chartOption;
      this.charts.last.initChart(chartOption);
    });
  }

  getAllTextChartOptions() {
    return chartOptions.pieChart({
      pie: {
        dispatch: {
          elementClick: ({data: {key: code}}) => this.allTextElementClick.emit({code})
        },
      }
    });
  }

  getShortTextChartOptions() {
    return chartOptions.pieChart({
      pie: {
        dispatch: {
          elementClick: ({data: {key: code}}) => this.shortTextElementClick.emit({code})
        },
      }
    });
  }

  getLongTextChartOptions() {
    return chartOptions.pieChart({
      pie: {
        dispatch: {
          elementClick: ({data: {key: code}}) => this.longTextElementClick.emit({code})
        },
      }
    });
  }

  getPerExecutionChartOptions(type?: string) {
    const options = type === 'stackedArea'
      ? chartOptions.stackedAreaChart()
      : chartOptions.multiBarChart({
        multibar: {
          dispatch: {
            elementClick: ({data: [time, ...rest], series: {key: code}}) => this.perExecutionElementClick.emit({time, code})
          },
        },
      });
    // format dates differently depending on the granularity
    options.chart.xAxis.tickFormat = (unix) => moment(unix * 1000).format(timeFormat(this.granularity));
    return options;
  }

  private transformAndApply(data: AggregateText[], granularity: string) {
    this.workerService.transform(data).subscribe((transformedData) => {
      this.applyData(this.mergeData(transformedData, granularity));
    });
  }

  // merge data entries based on granularity (hour, day, week, etc..)
  private mergeData(data, granularity: any) {
    console.log('mergeData');
    console.log(data);
    console.log(granularity);

    return data.reduce((acc, curr, index) => {
        console.log(acc, curr, index, data[index].name);
        if (acc.length > 0 && moment.unix(data[index - 1].name).isSame(moment.unix(curr.name), granularity)) {

          // const prev = acc[index - 1];
          // prev[1] += curr[1];
          // prev[2] += curr[2];
          // prev[3] += curr[3];
        } else {
          acc.push(curr);
        }
        return acc;
    }, []);
  }

  private applyData(data) {
    console.log('data', data);
    const perExecutionData = Object.keys(data).map((key) =>
      ({
        key,
        color: this.colorMap[key],
        values: data[key],
      }));

    console.log('perExecutionData', perExecutionData);

    const allTextData = perExecutionData.map((o) => (
      {
        name: o.key,
        value: o.values.reduce((acc, curr) => acc + curr[1], 0)
      }));

    const shortTextData = Object.keys(data)
      .map((language) => ({
        key: language,
        value: data[language].reduce((acc, curr) => acc + curr[2], 0),
        color: this.colorMap[language],
      }));

    const longTextData = Object.keys(data)
      .map((language) => ({
        key: language,
        value: data[language].reduce((acc, curr) => acc + curr[3], 0),
        color: this.colorMap[language],
      }));

    this.nrOfTexts = allTextData.reduce((acc, curr) => curr.value + acc, 0);
    this.nrOfShortTexts = shortTextData.reduce((acc, curr) => curr.value + acc, 0);
    this.nrOfLongTexts = longTextData.reduce((acc, curr) => curr.value + acc, 0);

    this.perExecutionData.next(perExecutionData);
    this.allTextData.next(allTextData);
    this.shortTextData.next(shortTextData);
    this.longTextData.next(longTextData);

    this.changeDetectorRef.markForCheck();
  }

  private reset() {
    this.data = [];
    this.perExecutionData.next([]);
    this.allTextData.next([]);
    this.shortTextData.next([]);
    this.longTextData.next([]);
    this.nrOfLongTexts = undefined;
    this.nrOfTexts = undefined;
    this.nrOfShortTexts = undefined;
  }

  private initChartOptions() {
    // globally set moment's locale to norwegian bokmål
    moment.locale('nb');

    this.allTextChartOptions = this.getAllTextChartOptions();
    this.shortTextChartOptions = this.getShortTextChartOptions();
    this.longTextChartOptions = this.getLongTextChartOptions();
    this.perExecutionChartOptions = this.getPerExecutionChartOptions();
  }
}
