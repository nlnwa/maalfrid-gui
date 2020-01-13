import {Injectable} from '@angular/core';
import {AuthService} from './auth/';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {AppConfigService} from './app.config.service';
import {ControllerService} from './controller.service';

@Injectable()
export class AppInitializerService {

  initialized = false;
  error: Error;

 constructor(private appConfig: AppConfigService,
             private oAuthService: OAuthService,
             private authService: AuthService,
             private controllerService: ControllerService) {
 }

  /**
   * NB! Preloading of dynamic configuration (initialize AppConfigService) is done in main.ts
   */
  async init() {
    try {
      const issuer = await this.controllerService.getOpenIdConnectIssuer();

      if (issuer) {
        this.appConfig.authConfig = new AuthConfig(Object.assign(this.appConfig.authConfig, {issuer}));

        this.oAuthService.configure(this.appConfig.authConfig);
        await this.oAuthService.loadDiscoveryDocumentAndTryLogin();
        if (!this.oAuthService.hasValidIdToken()){
          this.oAuthService.logOut(true);
        }
      }
      this.authService.roles = await this.controllerService.getRolesForActiveUser().toPromise();
      this.initialized = true;
    } catch (error) {
      this.error = error;
    }
  }
}
