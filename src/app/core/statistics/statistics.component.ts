import {ChangeDetectionStrategy, ChangeDetectorRef, Component, QueryList, ViewChildren} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {CrawlJob, Seed} from '../../shared/models/config.model';
import {chartOptions} from './charts';
import {Interval} from '../interval';

import * as moment from 'moment';
import {NvD3Component} from 'ng2-nvd3';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  @ViewChildren(NvD3Component) charts: QueryList<NvD3Component>;

  totalData: any[];
  perExecutionData: any[];
  shortTextData: any[];
  longTextData: any[];

  interval: Interval;
  seed: Seed;
  job: CrawlJob;

  constructor(private maalfridService: MaalfridService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  get options() {
    return chartOptions;
  }

  onSelectSeed(seed: Seed) {
    this.seed = seed;
    this.checkFulfillment();
  }

  onInterval(interval: Interval) {
    this.interval = interval;
    this.checkFulfillment();
  }

  private checkFulfillment() {
    if (this.seed && this.interval) {
      this.getExecutions();
    }
  }

  onClickMultiBar() {
    this.charts.last.clearElement();
    this.charts.last.options = this.options.multiBar; // need this or else the toolip gets corrupted
    this.charts.last.initChart(this.options.multiBar);
  }

  onClickStacked() {
    this.charts.last.clearElement();
    this.charts.last.options = this.options.stackedArea; // need this or else the toolip gets corrupted
    this.charts.last.initChart(this.options.stackedArea);
  }

  private reset() {
    this.perExecutionData = [];
    this.totalData = [];
    this.shortTextData = [];
    this.longTextData = [];
  }

  private getExecutions() {
    this.maalfridService.getExecutions({
      seed_id: this.seed.id,
      job_id: this.job ? this.job.id : '',
      start_time: this.interval.start
        .startOf('day')
        .toJSON(),
      end_time: this.interval.end
        .startOf('day')
        .toJSON(),
    })
      .subscribe((executions) => this.getStatistics(executions));
  }

  private getStatistics(executions) {
    this.reset();
    this.maalfridService.getStatistic({execution_id: executions.map((execution) => execution.executionId)})
      .subscribe(stats => {
        // const perLanguageData = this.getPerLanguageData(stats);
        const perLanguageData = this.getPerLanguageData(executions, stats);

        this.perExecutionData = Object.keys(perLanguageData).map((key) =>
          ({
            key,
            values: perLanguageData[key],
          }));

        this.totalData = this.perExecutionData.map((o) => (
          {
            key: o.key,
            value: o.values.reduce((acc, curr) => acc + curr[1], 0)
          }));

        this.shortTextData = Object.keys(perLanguageData)
          .map((language) => ({
            key: language,
            value: perLanguageData[language].reduce((acc, curr) => acc + curr[2], 0)
          }));

        this.longTextData = Object.keys(perLanguageData)
          .map((language) => ({
            key: language,
            value: perLanguageData[language].reduce((acc, curr) => acc + curr[3], 0),
          }));

        this.changeDetectorRef.markForCheck();
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
   * @returns {{key: string; values: any}[]}
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

