import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {StatisticsComponent} from './containers/statistics/statistics.component';
import {MaalfridService} from './services/maalfrid-service/maalfrid.service';
import {EntityListComponent} from './components/entity-list/entity-list.component';
import {IntervalComponent} from './components/interval/interval.component';
import {SeedListComponent} from './components/seed-list/seed-list.component';
import {UriListComponent} from './components/uri-list/uri-list.component';

import {TextComponent} from './components/text/text.component';
import {ChartComponent} from './components/chart/chart.component';
import {FilterComponent} from './components/filter/filter.component';
import {SliderComponent} from './components/slider/slider.component';
import {SelectComponent} from './components/select/select.component';
import {FilterSetListComponent} from './components/filter-set-list/filter-set-list.component';
import {NouisliderModule} from '../nouislider/ng2-nouislider';
import {FilterSetComponent} from './components/filter-set/filter-set.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {UriComponent} from './components/uri/uri.component';
import {ReportComponent} from './containers/report/report.component';
import {SharedModule} from '../shared/shared.module';
import { RegexpComponent } from './components/regexp/regexp.component';


@NgModule({
  declarations: [
    StatisticsComponent,
    EntityListComponent,
    IntervalComponent,
    SeedListComponent,
    StatisticsComponent,
    UriListComponent,
    FilterSetListComponent,
    TextComponent,
    ChartComponent,
    FilterComponent,
    SliderComponent,
    SelectComponent,
    FilterSetComponent,
    UriComponent,
    ReportComponent,
    RegexpComponent,
  ],
  imports: [
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    SharedModule,
  ],
  exports: [
    ReportComponent,
    StatisticsComponent,
  ],
  providers: [
    MaalfridService,
  ]
})
export class CoreModule {}
