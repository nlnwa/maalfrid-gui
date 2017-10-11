import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './material.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {StatisticsComponent} from './statistics/statistics.component';
import {MaalfridService} from './maalfrid-service/maalfrid.service';

import {NvD3Module} from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
  declarations: [
    AppComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    NvD3Module,
  ],
  providers: [MaalfridService],
  bootstrap: [AppComponent]
})
export class AppModule {}
