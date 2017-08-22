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
  title = '';
  options;
  data;
  rawdata;
  form: FormGroup;
  @ViewChild('nvd3') nvd3;


  constructor(private fb: FormBuilder,
              private appService: AppService) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      uri: '',
      lix: '',
      wc: '',
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

  submit(form) {
    console.log("GetStats: uri:" +form.uri +', lix: '+ form.lix +', wc: '+ form.wc);
    this.appService.getStats(form.uri, form.lix, form.wc).subscribe(val => {this.rawdata = val;
      var listami = [];
      JSON.parse(this.rawdata._body).forEach((val) => {
        var string = JSON.stringify(val).replace('{','').replace('}','').split(":");
        var key=string[0];
        var value=string[1];
        listami.push(JSON.parse(`{"key": ${key},"value": ${value}}`));
      });
      this.data=listami;

      //this.nvd3.chart.update()
    });
  /*this.data=this.appService.getStats(form.uri, form.lix, form.wc);

    this.title = 'Data for: '+form.uri+', lix: '+form.lix+' wc: '+form.wc;*/
  }

}

