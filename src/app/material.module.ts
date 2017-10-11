import {NgModule} from '@angular/core';

import {
  MatToolbarModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
} from '@angular/material';

const modules = [
  MatToolbarModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule {}
