import {Injectable} from '@angular/core';
import {AuthConfig, JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {RoleService} from './role.service';

@Injectable()
export class AuthService {

  constructor(private oauthService: OAuthService, private roleService: RoleService) {
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

  async initialize(authConfig: AuthConfig) {
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.configure(authConfig);
    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    } catch (err) {
      // noop
    } finally {
      await this.roleService.fetchRoles();
    }
  }
}
