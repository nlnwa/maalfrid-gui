import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IdpReply} from './shared/models/controller.model';
import {Environment} from './shared/models/environment.model';
import {AuthConfig} from 'angular-oauth2-oidc';

@Injectable()
export class AppConfig {

  private config: Environment;

  constructor(private http: HttpClient) {
    this.config = new Environment();
  }

  get apiGatewayUrl(): string {
    return this.config.apiGatewayUrl;
  }

  get authConfig(): AuthConfig {
    return this.config.authConfig;
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Load required app configuration
   *
   * @returns {Promise<any>}
   */
  async load(): Promise<any> {
    const config = await this.http.get(this.config.configUrl).first().toPromise();

    Object.assign(this.config, config);

    this.config.authConfig.issuer = await this.http.get<IdpReply>(this.config.apiGatewayUrl + '/control/idp')
      .toPromise()
      .then(reply => reply.open_id_connect_issuer || '');
  }
}
