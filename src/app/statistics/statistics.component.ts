import {Component, OnInit, ViewChild} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  data: any;
  options: any;

  queryTime: number;
  model = {
    url: ''
  };

  @ViewChild('nvd3') nvd3;

  private readonly pieChartOptions = {
    chart: {
      type: 'pieChart',
      height: 400,
      x: function (d) {
        return d.key;
      },
      y: function (d) {
        return d.value;
      },
      showLabels: true,
      duration: 100,
      labelThreshold: 0.01,
      labelSunbeamLayout: false,
      legend: {
        margin: {
          top: 10,
          right: 15,
          bottom: 5,
          left: 0
        }
      }
    }
  };

  constructor(private maalfridService: MaalfridService) {}

  ngOnInit() {
    this.options = this.pieChartOptions;
  }

  onSubmit() {
    const startTime = new Date().getTime();
    const query = {url: this.model.url};
    this.maalfridService.getStats(query)
      .do(() => this.queryTime = (new Date().getTime() - startTime))
      .subscribe(stats => {
        this.data = this.processStats(stats);
      });
  }

  onDetectLanguage() {
    console.log('onDetectLanguage');
  }

  private processStats(stats) {
    const data = [];
    Object.keys(stats.count).forEach((key) => {
      const value = parseInt(stats.count[key], 10) / stats.total * 100;
      data.push({key, value});
    });
    return data;
  }
}

