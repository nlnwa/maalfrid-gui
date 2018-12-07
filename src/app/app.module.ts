import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AppConfig} from './app.config';
import {AuthGuard, AuthService, RoleService, TokenInterceptor} from './shared/services/auth';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {OAuthModule} from 'angular-oauth2-oidc';
import {ApplicationErrorHandler, ErrorService} from './error';
import {HomeComponent} from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    AuthGuard,
    ErrorService,
    {
      provide: APP_INITIALIZER,
      useFactory: (conf: AppConfig, authService: AuthService) => () => conf.load(authService),
      deps: [AppConfig, AuthService],
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: ErrorHandler, useClass: ApplicationErrorHandler},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
