import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {AuthComponent} from './components/auth/auth.component';
import {AppRoutingModule} from '../app-routing.module';
import {ToolbarComponent} from './components/toolbar/toolbar.component';


@NgModule({
  declarations: [
    AuthComponent,
    ToolbarComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    MaterialModule,
  ],
  exports: [
    AuthComponent,
    ToolbarComponent,
    CommonModule,
    MaterialModule,
  ],
})
export class SharedModule {}
