import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Role, RoleList} from '../../../shared/';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class RoleService {

  private roles: Role[] = [];

  constructor(private http: HttpClient) {
  }

  fetchRoles(): Observable<Role[]> {
    return this.http.get<RoleList>(environment.apiGatewayUrl + '/control/activeroles')
      .pipe(
        map(reply => reply.role.map(role => Role[role])),
        map(roles => this.roles = roles),
      );
  }

  getRoles(): Role[] {
    return this.roles;
  }

  isAdmin(): boolean {
    return this.isRole(Role.ADMIN);
  }

  isCurator(): boolean {
    return this.isRole(Role.CURATOR);
  }

  isReadonly(): boolean {
    return this.isRole(Role.READONLY);
  }

  private isRole(role: Role) {
    return this.roles.includes(role);
  }
}
