import {Injectable} from '@angular/core';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {RoleService} from './role.service';
import {AppConfig} from '../app.config';

@Injectable()
export class AuthService {

  constructor(private oauthService: OAuthService, private appConfig: AppConfig, private roleService: RoleService) {
  }

  get claims() {
    return this.oauthService.getIdentityClaims();
  }

  get name() {
    return this.claims ? this.claims['name'] : null;
  }

  get email() {
    return this.claims ? this.claims['email'] : null;
  }

  get groups() {
    return this.claims ? this.claims['groups'] : null;
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
    this.roleService.fetchRoles();
  }

  configure(): Promise<any> {
    this.oauthService.configure(this.appConfig.environment.authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    return this.oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => this.roleService.fetchRoles())
      .catch(() => this.roleService.fetchRoles());
  }
}
