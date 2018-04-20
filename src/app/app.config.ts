import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IdpReply} from './shared/models/controller.model';
import {Environment} from './shared/models/environment.model';
import {environment} from '../environments/environment';

@Injectable()
export class AppConfig {

  private _env: Environment;

  constructor(private http: HttpClient) {
    this._env = new Environment(environment);
  }

  get environment(): Environment {
    return this._env;
  }

  /**
   * Load app configuration
   *
   * @returns {Promise<any>}
   */
  async load(): Promise<any> {
    const env = await this.http.get(environment.configUrl).toPromise()
    Object.assign(this._env, env);
    env.authConfig.issuer = await this.getOpenIdConnectIssuer();
        .then(issuer => {
          env.authConfig.issuer = issuer;
        }));
  }

  private getOpenIdConnectIssuer(): Promise<string> {
    return this.http.get<IdpReply>(this._env.apiGatewayUrl + '/control/idp')
      .toPromise()
      .then(reply => reply.open_id_connect_issuer || '');
  }
}
