import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {StatisticsComponent} from './statistics/statistics.component';
import {MaalfridService} from './maalfrid-service/maalfrid.service';
import {EntityListComponent} from './entity-list/entity-list.component';
import {ExecutionListComponent} from './execution-list/execution-list.component';
import {IntervalComponent} from './interval';
import {SeedListComponent} from './seed-list/seed-list.component';
import {SharedModule} from '../shared/shared.module';

import {NvD3Module} from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  declarations: [
    StatisticsComponent,
    EntityListComponent,
    ExecutionListComponent,
    IntervalComponent,
    SeedListComponent,
    StatisticsComponent,
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
