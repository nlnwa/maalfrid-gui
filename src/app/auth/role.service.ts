import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Role, RoleList} from '../core/models/config.model';
import {AppConfig} from '../app.config';

@Injectable()
export class RoleService {

  private roles: Role[] = [];

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  async fetchRoles() {
    this.roles = await this.http.get<RoleList>(this.appConfig.apiGatewayUrl + '/control/activeroles')
      .toPromise()
      .then((reply) => reply.role.map(role => Role[role]));
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
