import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {StatisticsComponent} from './containers/statistics/statistics.component';
import {MaalfridService} from './services/maalfrid-service/maalfrid.service';
import {EntityListComponent} from './components/entity-list/entity-list.component';
import {IntervalComponent} from './components/interval/interval.component';
import {SeedListComponent} from './components/seed-list/seed-list.component';
import {UriListComponent} from './components/uri-list/uri-list.component';
import {SharedModule} from '../shared/shared.module';

import {NvD3Module} from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { TextComponent } from './components/text/text.component';
import { ChartComponent } from './components/chart/chart.component';
import { FilterComponent } from './components/filter/filter.component';
import {NouisliderModule} from 'ng2-nouislider';

@NgModule({
  declarations: [
    StatisticsComponent,
    EntityListComponent,
    IntervalComponent,
    SeedListComponent,
    StatisticsComponent,
    UriListComponent,
    TextComponent,
    ChartComponent,
    FilterComponent,
  ],
  imports: [
    SharedModule,
    NvD3Module,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
  ],
  exports: [
    StatisticsComponent,
  ],
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        MaalfridService,
      ],
    };
  }
}
