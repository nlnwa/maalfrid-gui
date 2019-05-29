import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatCardModule
} from '@angular/material';

import {FlexLayoutModule} from '@angular/flex-layout';

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
  MatDividerModule,
  MatSortModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatCardModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
