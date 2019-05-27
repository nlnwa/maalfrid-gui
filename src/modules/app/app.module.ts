import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent, HomeComponent} from './components';
import {AppRoutingModule} from './routing/app-routing.module';
import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core/core.module';
import { EntitySelectorComponent } from './components/entity-selector/entity-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EntitySelectorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
