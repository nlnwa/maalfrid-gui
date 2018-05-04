import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';

import {FlexLayoutModule} from '@angular/flex-layout';

import {MatMomentDateModule} from '@angular/material-moment-adapter';

const modules = [
  FlexLayoutModule,
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
  MatMomentDateModule,
  MatDividerModule,
  MatSortModule,
  MatButtonToggleModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
