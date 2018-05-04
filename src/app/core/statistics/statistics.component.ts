import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {CrawlJob, Entity, Seed} from '../../shared/models/config.model';
import {chartOptions} from './charts';
import {Interval} from '../interval/interval.component';
import * as moment from 'moment';
import {NvD3Component} from 'ng2-nvd3';
import {from} from 'rxjs/observable/from';
import {finalize, mergeMap, tap} from 'rxjs/operators';
import {MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material';
import {SeedListComponent} from '../seed-list/seed-list.component';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements AfterViewInit {
  @ViewChildren(NvD3Component) charts: QueryList<NvD3Component>;
  @ViewChild(MatButtonToggleGroup) chartToggleGroup: MatButtonToggleGroup;
  @ViewChild(SeedListComponent) seedList: SeedListComponent;

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

  constructor(private maalfridService: MaalfridService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  get options() {
    return chartOptions;
  }

  ngAfterViewInit() {
    this.chartToggleGroup.change.subscribe((change: MatButtonToggleChange) => {
      this.charts.last.clearElement();
      this.charts.last.options = this.options[change.value];
      this.charts.last.initChart(this.options[change.value]);
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

  private checkFulfillment() {
    if (this.seeds && this.seeds.length > 0 && this.interval.end && this.interval.start) {
      this.getExecutions();
    } else {
      this.reset();
    }
  }

  private reset() {
    this.perExecutionData = [];
    this.allTextData = [];
    this.shortTextData = [];
    this.longTextData = [];
    this.nrOfLongTexts = undefined;
    this.nrOfTexts = undefined;
    this.nrOfShortTexts = undefined;
  }

  private getExecutions() {
    let executions = [];
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
      tap((result) => executions = result.concat(executions)),
      finalize(() => { if (executions.length > 0) {this.getStatistics(executions); }})
    ).subscribe();
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

        this.allTextData = this.perExecutionData.map((o) => (
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


        this.nrOfTexts = this.allTextData.reduce((acc, curr) => curr.value + acc, 0);
        this.nrOfShortTexts = this.shortTextData.reduce((acc, curr) => curr.value + acc, 0);
        this.nrOfLongTexts = this.longTextData.reduce((acc, curr) => curr.value + acc, 0);

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

