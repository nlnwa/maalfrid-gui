import {APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';


import localeNbExtra from '@angular/common/locales/extra/nb';
import localeNb from '@angular/common/locales/nb';

import {SharedModule} from '../shared/shared.module';
import {
  AppInitializerService,
  ApplicationErrorHandler,
  AuthGuard,
  AuthService,
  ErrorService,
  MaalfridService,
  SnackBarService,
  TokenInterceptor
} from './services/';
import {JwksValidationHandler, OAuthModule, OAuthService, ValidationHandler} from 'angular-oauth2-oidc';
import {AppConfigService} from './services/app.config.service';
import {EntityResolverService} from './services/entity-resolver.service';

registerLocaleData(localeNb, 'nb', localeNbExtra);

export function appInitializerFactory(appInitializerService: AppInitializerService,
                                      appConfigService: AppConfigService,
                                      oAuthService: OAuthService,
                                      authService: AuthService) {
  return () => appInitializerService.init(appConfigService, oAuthService, authService);
}

@NgModule({
  imports: [
    SharedModule.forRoot(),
    OAuthModule.forRoot(),
  ],
  providers: [
    ApplicationErrorHandler,
    AppInitializerService,
    AppConfigService,
    AuthService,
    AuthGuard,
    AuthService,
    MaalfridService,
    SnackBarService,
    ErrorService,
    TokenInterceptor,
    EntityResolverService,
    {provide: ValidationHandler, useClass: JwksValidationHandler},
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AppInitializerService, AppConfigService, OAuthService, AuthService],
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: ErrorHandler, useClass: ApplicationErrorHandler},
    {provide: LOCALE_ID, useValue: 'nb'},
  ]
})
export class CoreModule {
}
