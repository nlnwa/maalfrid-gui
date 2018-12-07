import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';

import {Role} from '../../../core/models/config.model';
import {RoleService} from './role.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public roleService: RoleService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const allowedRoles = route.data.allowedRoles as Role[];

    for (const role of this.roleService.getRoles()) {
      if (allowedRoles.includes(role)) {
        return of(true);
      }
    }
    return of(false);
  }

}
