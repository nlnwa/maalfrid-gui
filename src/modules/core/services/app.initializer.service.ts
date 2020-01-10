import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth/';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {AppConfigService} from './app.config.service';
import {AppConfig} from '../models/app.config.model';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
import {ControllerPromiseClient} from '../../../api/gen/controller/v1/controller_grpc_web_pb';
import {ControllerService} from './controller.service';

@Injectable()
export class AppInitializerService {

  initialized = false;
  error: Error;

//  constructor(private appConfig: AppConfigService,
//              private oAuthService: OAuthService,
//              private authService: AuthService,
//              private controllerService: ControllerService){
//  }
//
//   /**
//    * NB! Preloading of dynamic configuration (initialize AppConfigService) is done in main.ts
//    */
//   async init() {
//     try {
//       const issuer = await this.controllerService.getOpenIdConnectIssuer();
//
//       if (issuer) {
//         this.appConfig.authConfig = new AuthConfig(Object.assign(this.appConfig.authConfig, {issuer}));
//
//         this.oAuthService.configure(this.appConfig.authConfig);
//         await this.oAuthService.loadDiscoveryDocumentAndTryLogin();
//         if (!this.oAuthService.hasValidIdToken()){
//           this.oAuthService.logOut(true);
//         }
//       }
//       this.authService.roles = await this.controllerService.getRolesForActiveUser().toPromise();
//       this.initialized = true;
//     } catch (error) {
//       this.error = error;
//     }
//   }
// }

// old
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
             authService: AuthService): Promise<any> {
    try {
      const appConfig: AppConfig = await this.http.get<AppConfig>(environment.configUrl).toPromise();

      // resolve configuration
      appConfigService.apiUrl = appConfig.apiUrl || environment.apiUrl;
      appConfigService.grpcWebUrl = appConfig.grpcWebUrl || environment.grpcWebUrl;
      appConfigService.version = environment.version;

      const controllerPromiseClient = new ControllerPromiseClient(appConfigService.grpcWebUrl, null, null);

      const issuer = await controllerPromiseClient.getOpenIdConnectIssuer(new Empty())
        .then(response => response.getOpenIdConnectIssuer());

      const authConfig = new AuthConfig(Object.assign({}, environment.authConfig, appConfig.authConfig, {issuer}));

      oAuthService.configure(authConfig);
      await oAuthService.loadDiscoveryDocumentAndTryLogin();

      if (!oAuthService.hasValidIdToken()) {
        oAuthService.logOut(true);
      } else {
        authService.roles = await controllerPromiseClient.getRolesForActiveUser(new Empty(), authService.metadata)
          .then(roleList => roleList.getRoleList());
      }

      this.initialized = true;
    } catch (error) {
      this.error = error;
    }
  }
}
