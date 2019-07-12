import {Injectable} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {Role} from '../../../shared/models';

interface Claims {
  name: string;
  email: string;
  groups: string;
}

@Injectable()
export class AuthService {

  roles: Role[] = [Role.ANY];

  constructor(private oauthService: OAuthService) {
  }

  get claims(): Claims {
    return this.oauthService.getIdentityClaims() as Claims;
  }

  get name(): string {
    return this.claims ? this.claims.name : '';
  }

  get email(): string {
    return this.claims ? this.claims.email : '';
  }

  get groups(): string {
    return this.claims ? this.claims.groups : '';
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  /**
   * @returns authorization header for API calls
   */
  get metadata(): { authorization: string } {
    return {authorization: 'Bearer ' + this.idToken};
  }

  get requestedPath(): string {
    return this.oauthService.state;
  }

  get isLoggedIn(): boolean {
    return !!this.name;
  }

  get isAdmin(): boolean {
    return this.roles.includes(Role.ADMIN);
  }

  get isCurator(): boolean {
    return this.roles.includes(Role.CURATOR);
  }

  get isReadonly(): boolean {
    return this.roles.includes(Role.READONLY);
  }

  login(redirectUrl?: string): void {
    this.oauthService.initImplicitFlow(redirectUrl);
  }

  logout(): void {
    this.oauthService.logOut();
    this.roles = [Role.ANY];
  }
}
