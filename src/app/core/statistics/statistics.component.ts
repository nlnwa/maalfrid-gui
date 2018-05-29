import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {CrawlJob, Entity, Seed} from '../../shared/models/config.model';
import {chartOptions} from './charts';
import {Interval} from '../interval/interval.component';
import * as moment from 'moment';
import {NvD3Component} from 'ng2-nvd3';
import {catchError, finalize, mergeMap, tap} from 'rxjs/operators';
import {MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material';
import {SeedListComponent} from '../seed-list/seed-list.component';
import {from, of} from 'rxjs';
import {and, Predicate} from '../../shared/func';
import {AggregateExecution, AggregateText} from '../../shared/models/maalfrid.model';


function codeCondition(code: string): Predicate {
  return (e: AggregateText) => e.language === code;
}

function shortTextCondition(): Predicate {
  return (e: AggregateText) => e.wordCount <= 3500;
}

function longTextCondition(): Predicate {
  return (e: AggregateText) => !shortTextCondition()(e);
}

function timeCondition(time: number, granularity: string): Predicate {
  const t = moment.unix(time).utc();
  return (e: AggregateExecution) => moment(e.endTime).isSame(t, granularity as any);
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements AfterViewInit {

  @ViewChildren(NvD3Component) charts: QueryList<NvD3Component>;
  @ViewChild(MatButtonToggleGroup) chartToggleGroup: MatButtonToggleGroup;
  @ViewChild(SeedListComponent) seedList: SeedListComponent;

  perLanguageData: any;
  perExecutionData: any[];
  allTextData: any[];
  shortTextData: any[];
  longTextData: any[];

  nrOfTexts: number;
  nrOfShortTexts: number;
  nrOfLongTexts: number;

  interval: Interval;
  entity: Entity;
  seeds: Seed[];
  job: CrawlJob;
  text: String;
  texts: AggregateText[];
  executions: AggregateExecution[];

  allTextChartOptions: any;
  shortTextChartOptions: any;
  longTextChartOptions: any;
  perExecutionChartOptions: any;


  colorMap = {
    // 'NOB': 'red',
    // 'NNO': 'green',
  };

  granularity = 'hour';

  constructor(private maalfridService: MaalfridService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.initChartOptions();
  }

  ngAfterViewInit() {
    this.chartToggleGroup.change.subscribe((change: MatButtonToggleChange) => {
      this.charts.last.clearElement();
      const chartOption = this.getPerExecutionChartOptions(change.value);
      this.charts.last.options = chartOption;
      this.charts.last.initChart(chartOption);
    });
  }

  onGranularity(granularity: string) {
    this.granularity = granularity;
    this.applyData();
  }

  onText(warcId: string) {
    this.maalfridService.getText(warcId)
      .pipe(
        catchError((err) => {
          console.error(err.message);
          return of(undefined);
        })
      )
      .subscribe((value) => {
        this.text = value;
        this.changeDetectorRef.markForCheck();
      });
  }

  onSelectEntity(entity: Entity) {
    this.entity = entity;
    this.seedList.entity = entity;
  }

  onSelectSeed(seeds: Seed[]) {
    this.seeds = seeds;
    this.checkFulfillment();
  }

  onInterval(interval: Interval) {
    this.interval = interval;
    this.checkFulfillment();
  }

  getAllTextChartOptions() {
    return chartOptions.pieChart({
      pie: {
        dispatch: {
          elementClick: ({data: {key: code}}) => {
            this.texts = this.executions
              .reduce((acc, curr) => acc.concat(curr.texts), [])
              .filter(codeCondition(code));
            this.changeDetectorRef.markForCheck();
          }
        },
      }
    });
  }

  getShortTextChartOptions() {
    return chartOptions.pieChart({
      pie: {
        dispatch: {
          elementClick: ({data: {key: code}}) => {
            this.texts = this.executions
              .reduce((acc, curr) => acc.concat(curr.texts), [])
              .filter(and([codeCondition(code), shortTextCondition()]));
            this.changeDetectorRef.markForCheck();
          }
        },
      }
    });
  }

  getLongTextChartOptions() {
    return chartOptions.pieChart({
      pie: {
        dispatch: {
          elementClick: ({data: {key: code}}) => {
            this.texts = this.executions
              .reduce((acc, curr) => acc.concat(curr.texts), [])
              .filter(and([codeCondition(code), longTextCondition()]));
            this.changeDetectorRef.markForCheck();
          }
        },
      }
    });
  }

  getPerExecutionChartOptions(type?: string) {
    return type === 'stackedArea'
      ? chartOptions.stackedAreaChart()
      : chartOptions.multiBarChart({
        multibar: {
          dispatch: {
            elementClick: ({data: [time, ...rest], series: {key: code}}) => {
              this.texts = this.executions
                .filter(timeCondition(time, this.granularity))
                .reduce((acc, curr) =>
                  acc.concat(curr.texts.map((text: AggregateText) => text)), [])
                .filter(codeCondition(code));
              this.changeDetectorRef.markForCheck();
            }
          },
        },
      });
  }

  private initChartOptions() {
    this.allTextChartOptions = this.getAllTextChartOptions();
    this.shortTextChartOptions = this.getShortTextChartOptions();
    this.longTextChartOptions = this.getLongTextChartOptions();
    this.perExecutionChartOptions = this.getPerExecutionChartOptions();
  }

  private checkFulfillment() {
    if (this.seeds && this.seeds.length > 0 && this.interval.end && this.interval.start) {
      this.getExecutions();
    } else {
      this.reset();
    }
  }

  private reset() {
    this.text = undefined;
    this.texts = [];
    this.perExecutionData = [];
    this.allTextData = [];
    this.shortTextData = [];
    this.longTextData = [];
    this.nrOfLongTexts = undefined;
    this.nrOfTexts = undefined;
    this.nrOfShortTexts = undefined;
  }

  private getExecutions() {
    this.executions = [];
    from(this.seeds).pipe(
      mergeMap((seed) =>
        this.maalfridService.getExecutions({
          seed_id: seed.id,
          job_id: this.job ? this.job.id : '',
          start_time: this.interval.start
            .startOf('day')
            .toJSON(),
          end_time: this.interval.end
            .startOf('day')
            .toJSON(),
        })),
      tap((result) => this.executions = result.concat(this.executions)),
      finalize(() => {
        if (this.executions.length > 0) {
          this.getStatistics(this.executions);
          this.texts = this.executions.reduce((acc, curr) => acc.concat(curr.texts), []);
        }
      })
    ).subscribe();
  }

  private mergeData(data, granularity) {
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

  private applyData() {
    if (!this.perLanguageData) {
      return;
    }

    const data = this.mergeData(this.perLanguageData, this.granularity);

    this.perExecutionData = Object.keys(data).map((key) =>
      ({
        key,
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

  private getStatistics(executions) {
    this.reset();
    this.maalfridService.getStatistic({execution_id: executions.map((execution: AggregateExecution) => execution.executionId)})
      .subscribe(stats => {
        this.perLanguageData = this.getPerLanguageData(executions, stats);
        this.applyData();
      });
  }

  // Data sample:
  // [
  //   [ {count: 2, language: 'NOB', long: 2,...}, {count: 1, language: 'NNO', ...}],
  //   [ {count: 0, language: 'FRA', ...}, ...]
  // ]
  private getSetOfLanguages(stats): Set<string> {
    return stats.reduce((acc, curr) => {
      // For each object of the inner array (curr) , add its language to the set (acc) and return the set
      curr.forEach((stat) => acc.add(stat.language));
      return acc;
    }, new Set());
  }

  /**
   * Data samples:
   *
   * stats (Array(2)):
   * [
   *   [ {count: 2, language: 'NOB', long: 2,...}, {count: 1, language: 'NNO', ...}],
   *   [ {count: 0, language: 'FRA', ...}, ...]
   * ]
   *
   * executions (Array(2)):
   * [
   *   { endTime: "2018-04-19T01:04:29.043Z", ...},
   *   {endTime: "2018-04-17T12:34:02.693Z", ...},
   * ]
   *
   * @param executions
   * @param stats
   * @returns {any[]}
   */
  private getPerLanguageData(executions, stats) {
    const data = {};
    this.getSetOfLanguages(stats).forEach((language) => {
      data[language] = stats
        .map((stat, index) => {
          // const totalCount = stat.reduce((acc, curr) => acc + curr.count, 0);
          const date = moment(executions[index].endTime).unix();
          const found = stat.find((element) => element.language === language);
          return found
            ? [date, found.count, found.short, found.long]
            : [date, 0, 0, 0];
        })
        .sort((a, b) => a[0] - b[0]);
    });
    return data;
  }
}
