import {NgModule} from '@angular/core';
import {StatisticsComponent} from './containers/statistics/statistics.component';
import {EntityListComponent} from './components/entity-list/entity-list.component';
import {IntervalComponent} from './components/interval/interval.component';
import {SeedListComponent} from './components/seed-list/seed-list.component';
import {UriListComponent} from './components/uri-list/uri-list.component';
import {FilterSetListComponent} from './components/filter-set-list/filter-set-list.component';
import {TextComponent} from './components/text/text.component';
import {ChartComponent} from './components/chart/chart.component';
import {FilterComponent} from './components/filter/filter.component';
import {SliderComponent} from './components/slider/slider.component';
import {SelectComponent} from './components/select/select.component';
import {FilterSetComponent} from './components/filter-set/filter-set.component';
import {UriComponent} from './components/uri/uri.component';
import {RegexpComponent} from './components/regexp/regexp.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {NouisliderModule} from '../nouislider/ng2-nouislider';
import {SharedModule} from '../shared/shared.module';
import {ExploreRoutingModule} from './routing/explore-routing.module';

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
    RegexpComponent,
  ],
  imports: [
    ExploreRoutingModule,
    SharedModule,
    NgxChartsModule,
    NouisliderModule,
  ],
})
export class ExploreModule { }
