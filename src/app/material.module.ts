import {NgModule} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MomentDateAdapter} from './commons/moment-date-adapter';
import {MOMENT_DATE_FORMATS} from './commons/moment-date-formats';

const modules = [
  MatToolbarModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatTableModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS},
  ]
})
export class MaterialModule {}
