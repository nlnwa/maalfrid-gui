import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from './material.module';
import {RouterModule} from '@angular/router';
import {DateFnsDateAdapter, MAT_DATE_FNS_DATE_FORMATS} from './date-fns-date-adapter';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import {AuthComponent, ToolbarComponent} from './components';

@NgModule({
  declarations: [ToolbarComponent, AuthComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ToolbarComponent,
    AuthComponent,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        DateFnsDateAdapter,
        {
          provide: DateAdapter,
          useClass: DateFnsDateAdapter
        },
        {
          provide: MAT_DATE_FORMATS,
          useValue: MAT_DATE_FNS_DATE_FORMATS
        },
      ]
    };
  }
}
