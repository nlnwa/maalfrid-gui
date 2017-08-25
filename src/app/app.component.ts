import {Component, OnInit, ViewChild} from "@angular/core";
import {FormGroup, FormBuilder} from "@angular/forms";
import {AppService} from "./app.service";
declare let d3: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title;
  options;
  count;
  wc;
  lix;
  queryTime;
  lngdata;
  data;
  perc;
  rawdata;
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


  getStats(form) {
    var startTime = new Date().getTime();
    this.appService.getStats(form).subscribe(val => {
      this.rawdata = val;
      var datalist = [];
      var stats = JSON.parse(this.rawdata._body);
      if (stats.total > 0) {
        var splitted = (JSON.stringify(stats.count).replace('{', '').replace('}', '').split(","));
        splitted.forEach((val) => {
          var key = (val.split(":")[0]);
          var value = (val.split(":")[1]);
          datalist.push(JSON.parse(`{"key": ${key},"value": ${(parseInt(value) / stats.total * 100)}}`));
        });
      }
      else {
        var datalist = [];
      }
      this.queryTime = (new Date().getTime() - startTime);
      this.data = datalist;
      this.count = stats.total;
      this.perc = (stats.count);

      //this.nvd3.chart.update()
    });
  }

  getLang(form) {
    console.log(form);
    this.appService.getLang(form).subscribe(val => {
      var potet = val;
      this.lngdata = JSON.parse(potet._body);
    })
  }

}

