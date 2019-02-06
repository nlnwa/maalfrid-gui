import {APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {
  AppInitializer,
  ApplicationErrorHandler,
  AuthGuard,
  AuthService,
  ErrorService,
  MaalfridService,
  RoleService,
  SnackBarService,
  TokenInterceptor
} from './services/';
import {OAuthModule} from 'angular-oauth2-oidc';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    OAuthModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthGuard,
    RoleService,
    MaalfridService,
    SnackBarService,
    ErrorService,
    TokenInterceptor,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    AppInitializer,
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: AppInitializer) => () => appInitializer.load(),
      deps: [AppInitializer],
      multi: true
    },
    ApplicationErrorHandler,
    {provide: ErrorHandler, useClass: ApplicationErrorHandler},
    {provide: LOCALE_ID, useValue: 'nb'},
  ]
})
export class CoreModule {
}
