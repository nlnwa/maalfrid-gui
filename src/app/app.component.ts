import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {AppService} from './app.service';

declare const d3: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  options;
  count;
  wc;
  lix;
  queryTime;
  lngdata;
  data;
  perc;
  leftform: FormGroup;
  rightform: FormGroup;
  @ViewChild('nvd3') nvd3;


  constructor(private fb: FormBuilder,
              private appService: AppService) {

  }

  ngOnInit() {
    this.leftform = this.fb.group({
      url: '',
      lix: '',
      wc: '',
      cc: '',
      lwc: '',
      sc: '',
    });
    this.rightform = this.fb.group({
      lngurl: '',
      code: '',
    });

    this.options = {

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
    this.data = '';
  }


  processStats(stats) {
    const data = [];
    if (stats.total > 0) {
      for (const key in stats.count) {
        if (stats.count.hasOwnProperty(key)) {
          const value = parseInt(stats.count[key], 10) / stats.total * 100;
          data.push({key, value});
        }
      }
    }
    return data;
  }


  getStats(form) {
    const startTime = new Date().getTime();

    this.appService.getStats(form).subscribe(result => {
      const stats = JSON.parse(result._body);
      this.data = this.processStats(stats);
      this.queryTime = (new Date().getTime() - startTime);
      this.count = stats.total;
      this.perc = (stats.count);
    });
  }


  getLang(form) {
    console.log(form);
    this.appService.getLang(form).subscribe(result => {
      this.lngdata = JSON.parse(result._body);
    });
  }
}

