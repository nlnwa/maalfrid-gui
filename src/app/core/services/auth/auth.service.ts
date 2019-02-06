import {Injectable} from '@angular/core';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {RoleService} from './role.service';
import {environment} from '../../../../environments/environment';
import {from, Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';

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

  initialize(issuer: string): Observable<any> {
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.configure({...environment.authConfig, issuer});

    return from(this.oauthService.loadDiscoveryDocumentAndTryLogin())
      .pipe(
        switchMap(() => this.roleService.fetchRoles()),
        catchError(() => of(null))
      );
  }
}
