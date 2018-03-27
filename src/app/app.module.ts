import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AppConfig} from './app.config';
import {AuthService, RoleService, TokenInterceptor} from './auth';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {OAuthModule} from 'angular-oauth2-oidc';
import {ApplicationErrorHandler, ErrorService} from './error';
import {VeidemannService} from './core/veidemann-service/veidemann.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    OAuthModule.forRoot(),
    CoreModule.forRoot(),
  ],
  providers: [
    AppConfig,
    AuthService,
    RoleService,
    ErrorService,
    VeidemannService,
    {provide: APP_INITIALIZER, useFactory: (conf: AppConfig) => () => conf.load(), deps: [AppConfig], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: ErrorHandler, useClass: ApplicationErrorHandler},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
