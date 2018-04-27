import {Injectable} from '@angular/core';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {AppConfig} from '../app.config';
import {RoleService} from './role.service';
import {Resolve} from '@angular/router';

@Injectable()
export class AuthService implements Resolve<void> {

  constructor(private appConfig: AppConfig, private oauthService: OAuthService, private roleService: RoleService) {
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.configure(this.appConfig.authConfig);
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

  get isLoggedIn() {
    return this.oauthService.hasValidIdToken();
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
    this.roleService.fetchRoles();
  }

  async resolve(): Promise<void> {
    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    } catch (err) {
      console.log(err);
    }
    finally {
      await this.roleService.fetchRoles();
    }
  }
}
