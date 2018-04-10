import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {CrawlJob, Seed} from '../../shared/models/config.model';
import {options} from './charts';
import {Interval} from '../interval';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RoleService} from '../../auth/role.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  totalData: any;
  perExecutionData: any;
  nobData: any;
  nnoData: any;

  pieChartOptions: any;
  multiBarChartOptions: any;

  total: number;

  interval: Interval;
  seed: Seed;
  job: CrawlJob;

  executions: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private maalfridService: MaalfridService,
              private changeDetectorRef: ChangeDetectorRef,
              private roleService: RoleService) {

    this.pieChartOptions = options.pieChart;
    this.multiBarChartOptions = options.multiBarChart;
  }

  onSelectSeed(seed: Seed) {
    this.seed = seed;
    this.checkFulfillment();
  }

  /*
  onSelectCrawlJob(job: CrawlJob) {
    this.job = job;
    this.checkFulfillment();
  }
*/

  onInterval(interval: Interval) {
    this.interval = interval;
    this.checkFulfillment();
  }

  onSelectExecution(executions: any) {
    this.total = 0;
    this.totalData = null;
    this.perExecutionData = null;
    if (executions.length > 0) {
      this.getStatistics(executions);
    } else {
      this.perExecutionData = [];
      this.totalData = [];
      this.nobData = [];
      this.nnoData = [];
    }
  }

  private checkFulfillment() {
    if (this.seed && this.interval) {
      this.getExecutions();
    }
  }

  private getStatistics(executions) {
    this.total = 0;

    this.maalfridService.getStatistic({execution_id: executions.map((execution) => execution.id)})
      .subscribe(stats => {
        this.perExecutionData = this.getMultiBarChartData(executions, stats);
        this.totalData = this.getPieChartData(this.perExecutionData);
        this.nobData = this.getLanguageData(stats, 'NOB');
        this.nnoData = this.getLanguageData(stats, 'NNO');

        this.changeDetectorRef.markForCheck();
      });
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
      .subscribe((executions) => {
        this.executions.next(executions);

        this.changeDetectorRef.markForCheck();
      });
  }

  private getPieChartData(perExecutionData) {
    return perExecutionData.map((o) => ({key: o.key, value: o.values.reduce((acc, curr) => acc + curr[1], 0)}));
  }


  private getLanguageData(stats, language) {
    let short = 0;
    let long = 0;
    stats.forEach((execution) => {
      execution.some((statistic) => {
        if (statistic.language === language) {
          short += statistic.short;
          long += statistic.long;
          return true; // break
        } else {
          return false; // continue
        }
      });
    });
    if (short === 0 && long === 0) {
      return [];
    }
    return [{key: 'Korte tekster', value: short}, {key: 'Lange tekster', value: long}];
  }

  private getMultiBarChartData(executions, stats) {
    const data = {};
    stats.forEach((execution, index) => {
      const total = execution.reduce((acc, curr) => acc + curr.total, 0);
      execution.forEach((statistic) => {
        const value = [executions[index].endTime, statistic.total];
        if (!data.hasOwnProperty(statistic.language)) {
          data[statistic.language] = [value];
        } else {
          data[statistic.language].push(value);
        }
      });
    });

    // fill in totalData where an execution is missing an entry for
    // a language another execution in the dataset has got
    Object.keys(data).forEach((language) => {
      if (data[language].length < executions.length) {
        executions.forEach((execution, index) => {
          const missingValue = [execution.endTime, 0];
          if (!data[language][index]) {
            data[language].push(missingValue);
          } else if (data[language][index][0] !== execution.endTime) {
            data[language].push(missingValue);
          }
        });
      }
    });

    // convert to nvd3 totalData format
    return Object.keys(data).map((key) => ({
      key,
      values: data[key],
    }));
  }
}

