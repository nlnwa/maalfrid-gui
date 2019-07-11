import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {Observable, of} from 'rxjs';

import {Role} from '../../../shared/';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  private static rolesByPath = {
    rapport: [Role.CURATOR, Role.ADMIN],
    utforsk: [Role.CURATOR, Role.ADMIN]
  };

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = route.data.allowedRoles as Role[];

    if (this.authService.roles.some(role => allowedRoles.includes(role))) {
      return true;
    }

    if (state.url) {
      this.authService.login(state.url);
    }

    return false;
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = AuthGuard.rolesByPath[route.path] || [Role.ANY];

    for (const role of this.authService.roles) {
      if (allowedRoles.includes(role)) {
        return true;
      }
    }

    this.authService.login(segments.join('/'));

    return false;
  }
}
