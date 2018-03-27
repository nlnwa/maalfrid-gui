import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Role, RoleList} from '../shared/models/config.model';
import {AppConfig} from '../app.config';

@Injectable()
export class RoleService {

  private readonly URL: string = this.appConfig.environment.apiGatewayUrl + '/control/activeroles';

  private roles: Role[] = [];

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  public fetchRoles(): Promise<Role[]> {
    return this.http.get<RoleList>(this.URL).toPromise()
      .then(reply => reply.role.map(role => Role[role]))
      .then(roles => this.roles = roles);
  }

  public getRoles(): Role[] {
    return this.roles;
  }

  public isAdmin(): boolean {
    return this.isRole(Role.ADMIN);
  }

  public isCurator(): boolean {
    return this.isRole(Role.CURATOR);
  }

  public isReadonly(): boolean {
    return this.isRole(Role.READONLY);
  }

  private isRole(role: Role) {
    return this.roles.includes(role);
  }
}
