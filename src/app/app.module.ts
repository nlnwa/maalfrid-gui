import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NvD3Component } from 'ng2-nvd3';
import {AppService} from '../app/app.service';


import { AppComponent } from './app.component';
import 'd3';
import 'nvd3';


@NgModule({
  declarations: [
    AppComponent,
    NvD3Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
