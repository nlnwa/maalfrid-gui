import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth/';
import {IdpReply, Role, RoleList} from '../../shared/models';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {AppConfigService} from './app.config.service';
import {AppConfig} from '../models/app.config.model';

@Injectable()
export class AppInitializerService {

  initialized = false;
  error: Error;

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param appConfigService Configuration service
   * @param oAuthService OIDC service
   * @param authService Auth service
   */
  async init(appConfigService: AppConfigService,
             oAuthService: OAuthService,
             authService: AuthService) {
    try {
      const appConfig: AppConfig = await this.getAppConfig(environment.config);

      appConfigService.apiUrl = environment.apiUrl;
      appConfigService.version = environment.version;

      const issuer = await this.getOpenIdConnectIssuer(environment.apiGatewayUrl);

      const authConfig = new AuthConfig(Object.assign({}, environment.authConfig, appConfig.authConfig, {issuer}));

      oAuthService.configure(authConfig);
      await oAuthService.loadDiscoveryDocumentAndTryLogin();

      if (!oAuthService.hasValidIdToken()) {
        oAuthService.logOut(true);
      } else {
        authService.roles = await this.getRoles(environment.apiGatewayUrl);
      }

      this.initialized = true;
    } catch (error) {
      this.error = error;
    }
  }

  private getAppConfig(configUrl: string): Promise<AppConfig> {
    return this.http.get<AppConfig>(configUrl).toPromise();
  }

  private getOpenIdConnectIssuer(apiGatewayUrl: string): Promise<string> {
    return this.http.get<IdpReply>(apiGatewayUrl + '/control/idp').toPromise()
      .then(reply => reply.open_id_connect_issuer || '');
  }

  private getRoles(apiGatewayUrl: string): Promise<Role[]> {
    return this.http.get<RoleList>(apiGatewayUrl + '/control/activeroles').toPromise()
      .then(res => res.role.map(role => Role[role]));
  }
}
