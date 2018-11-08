import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
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
export class ChartComponent implements OnInit, AfterViewInit {

  defaultMap = colorMaps['maalfrid'];
  private readonly colorMap;

  private _granularity = 'week';
  private _data: AggregateText[] = [];

  @Input()
  set granularity(granularity: string) {
    this._granularity = granularity;
    this.applyData(this.mergeData(this._data, granularity));
  }

  @Input()
  set data(data) {
    if (data && Object.keys(data).length > 0) {
      this.workerService.transform(data).subscribe((val) => {
        this._data = val;
        this.applyData(this.mergeData(this._data, this._granularity));
      });
    } else {
      this.reset();
    }
  }

  @Output()
  allTextElementClick = new EventEmitter();
  @Output()
  shortTextElementClick = new EventEmitter();
  @Output()
  longTextElementClick = new EventEmitter();
  @Output()
  perExecutionElementClick = new EventEmitter();

  perExecutionData: any[];
  allTextData: any[];
  shortTextData: any[];
  longTextData: any[];

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
  }

  ngOnInit() {
  }

  reset() {
    this.perExecutionData = [];
    this.allTextData = [];
    this.shortTextData = [];
    this.longTextData = [];
    this.nrOfLongTexts = undefined;
    this.nrOfTexts = undefined;
    this.nrOfShortTexts = undefined;
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
    options.chart.xAxis.tickFormat = (unix) => moment(unix * 1000).format(timeFormat(this._granularity));
    return options;
  }

  private applyData(data) {
//     acc[curr].forEach((set) => set[0] = moment.unix(set[0]).format(timeFormat(granularity)));

    this.perExecutionData = Object.keys(data).map((key) =>
      ({
        key,
        color: this.colorMap[key],
        values: data[key],
      }));

    this.allTextData = this.perExecutionData.map((o) => (
      {
        key: o.key,
        value: o.values.reduce((acc, curr) => acc + curr[1], 0),
        color: this.colorMap[o.key],
      }));

    this.shortTextData = Object.keys(data)
      .map((language) => ({
        key: language,
        value: data[language].reduce((acc, curr) => acc + curr[2], 0),
        color: this.colorMap[language],
      }));

    this.longTextData = Object.keys(data)
      .map((language) => ({
        key: language,
        value: data[language].reduce((acc, curr) => acc + curr[3], 0),
        color: this.colorMap[language],
      }));


    this.nrOfTexts = this.allTextData.reduce((acc, curr) => curr.value + acc, 0);
    this.nrOfShortTexts = this.shortTextData.reduce((acc, curr) => curr.value + acc, 0);
    this.nrOfLongTexts = this.longTextData.reduce((acc, curr) => curr.value + acc, 0);

    this.changeDetectorRef.markForCheck();
  }

  // merge data entries based on granularity (hour, day, week, etc..)
  private mergeData(data, granularity: any) {
    return Object.keys(data).reduce((acc, curr) => {
      acc[curr] = data[curr].reduce((a, c) => {
        if (a.length > 0 && moment.unix(a[a.length - 1][0]).isSame(moment.unix(c[0]), granularity)) {
          const prev = a[a.length - 1];
          prev[1] += c[1];
          prev[2] += c[2];
          prev[3] += c[3];
        } else {
          a.push(c);
        }
        return a;
      }, []);
      return acc;
    }, {});
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
