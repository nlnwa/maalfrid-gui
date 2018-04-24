import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Role, RoleList} from '../shared/models/config.model';
import {AppConfig} from '../app.config';

@Injectable()
export class RoleService {

  private readonly apiGatewayUrl: string;

  private roles: Role[] = [];

  constructor(private http: HttpClient, private appConfig: AppConfig) {
    this.apiGatewayUrl = this.appConfig.apiGatewayUrl;
  }

  fetchRoles(): Promise<Role[]> {
    return this.http.get<RoleList>(this.apiGatewayUrl + '/control/activeroles')
      .toPromise()
      .then(reply => reply.role.map(role => Role[role]))
      .then(roles => this.roles = roles);
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
