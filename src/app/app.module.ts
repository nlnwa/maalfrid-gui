import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from './material.module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {NvD3Module} from 'ng2-nvd3';
import 'd3';
import 'nvd3';

import {StatisticsComponent} from './statistics/statistics.component';
import {MaalfridService} from './maalfrid-service/maalfrid.service';
import {EntityListComponent} from './entity-list/entity-list.component';
import {SeedListComponent} from './seed-list/seed-list.component';
import {VeidemannService} from './veidemann-service/veidemann.service';
import {ExecutionListComponent} from './execution-list/execution-list';
import {CrawljobListComponent} from './crawljob-list/crawljob-list.component';
import {IntervalComponent} from './interval/interval.component';

@NgModule({
  declarations: [
    AppComponent,
    StatisticsComponent,
    EntityListComponent,
    SeedListComponent,
    ExecutionListComponent,
    CrawljobListComponent,
    IntervalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    NvD3Module,
    FlexLayoutModule,
  ],
  providers: [
    MaalfridService,
    VeidemannService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
