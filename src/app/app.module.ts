import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import {AppService} from '../app/app.service';
import { NvD3Module } from 'ng2-nvd3';



import { AppComponent } from './app.component';
import 'd3';
import 'nvd3'


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NvD3Module,
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
