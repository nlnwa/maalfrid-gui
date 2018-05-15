import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {StatisticsComponent} from './statistics/statistics.component';
import {MaalfridService} from './maalfrid-service/maalfrid.service';
import {EntityListComponent} from './entity-list/entity-list.component';
import {IntervalComponent} from './interval/interval.component';
import {SeedListComponent} from './seed-list/seed-list.component';
import {UriListComponent} from './uri-list/uri-list.component';
import {SharedModule} from '../shared/shared.module';

import {NvD3Module} from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  declarations: [
    StatisticsComponent,
    EntityListComponent,
    IntervalComponent,
    SeedListComponent,
    StatisticsComponent,
    UriListComponent,
  ],
  imports: [
    SharedModule,
    NvD3Module,
    FormsModule,
    ReactiveFormsModule,
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
