import {APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';


import localeNbExtra from '@angular/common/locales/extra/nb';
import localeNb from '@angular/common/locales/nb';

import {JwksValidationHandler, OAuthModule, OAuthService, ValidationHandler} from 'angular-oauth2-oidc';
import {SharedModule} from '../shared/shared.module';

import {
  AppInitializerService,
  ApplicationErrorHandler,
  AuthGuard,
  AuthService, ControllerService,
  ErrorService,
  MaalfridService,
  SnackBarService,
  TokenInterceptor
} from './services/';

import {AppConfigService} from './services/app.config.service';
import {EntityResolverService} from './services/entity-resolver.service';
import {environment} from '../../environments/environment';

registerLocaleData(localeNb, 'nb', localeNbExtra);

@NgModule({
  imports: [
    SharedModule.forRoot(),
    OAuthModule.forRoot(),
  ],
  providers: [
    AppInitializerService,
    AuthService,
    AuthGuard,
    AuthService,
    OAuthService,
    ControllerService,
    MaalfridService,
    SnackBarService,
    ErrorService,
    TokenInterceptor,
    EntityResolverService,
    {provide: ValidationHandler, useClass: JwksValidationHandler},
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializerService: AppInitializerService) => () => appInitializerService.init(),
      deps: [AppInitializerService, AppConfigService, OAuthService, ControllerService, AuthService],
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: ErrorHandler, useClass: ApplicationErrorHandler},
    {provide: LOCALE_ID, useValue: environment.locale},
  ]
})
export class CoreModule {
}
