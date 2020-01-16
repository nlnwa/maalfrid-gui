import {Injectable} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {Role} from '../../../shared/models';
import {Metadata} from 'grpc-web';

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

  get isLoggedIn(): boolean {
    return this.roles.some(role => role !== Role.ANY);
  }

  get requestPath(): string{
    return this.oauthService.state;
  }

  /**
   * @returns authorization header for API calls
   */

  get metadata(): Metadata {
    const idToken = this.oauthService.getIdToken();
    if (idToken){
      return {authorization: 'Bearer ' + idToken};
    } else {
      return null;
    }
  }

  isAuthorized(roles: Role[]): boolean {
    for (const role of this.roles) {
      if (roles.includes(role)){
        return true;
      }
    }
    return false;
  }

  get requestedPath(): string {
    return this.oauthService.state;
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
