import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';

import {Role} from '../../../shared/';
import {RoleService} from './role.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public roleService: RoleService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const allowedRoles = route.data.allowedRoles as Role[];

    if (this.roleService.getRoles().some(role => allowedRoles.includes(role))) {
      return of(true);
    }
    return of(false);
  }
}
