import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './components';
import {AppRoutingModule} from './routing/app-routing.module';
import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core/core.module';
import {PublicModule} from '../public/public.module';
import {registerLocaleData} from '@angular/common';
import localeNb from '@angular/common/locales/nb';
import localeNn from '@angular/common/locales/nn';

registerLocaleData(localeNn, 'nn');
registerLocaleData(localeNb, 'nb');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    PublicModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
