import {NgModule} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule} from '@angular/material';

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
  MatCardModule,
  MatDialogModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
