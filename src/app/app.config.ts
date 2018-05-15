import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IdpReply} from './shared/models/controller.model';
import {Environment} from './shared/models/environment.model';
import {AuthService} from './auth';
import {first} from 'rxjs/operators';

@Injectable()
export class AppConfig {

  private config: Environment;

  constructor(private http: HttpClient) {
    this.config = new Environment();
  }

  get apiGatewayUrl(): string {
    return this.config.apiGatewayUrl;
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Load required app configuration
   *
   * @returns {Promise<any>}
   */
  async load(authService: AuthService) {
    // get dynamic config
    const config = await this.http.get(this.config.configUrl).pipe(first()).toPromise();

    Object.assign(this.config, config);

    // get OpenID Connect issuer
    this.config.authConfig.issuer = await this.http.get<IdpReply>(this.config.apiGatewayUrl + '/control/idp')
      .toPromise()
      .then(reply => reply.open_id_connect_issuer || '');

    // initialize authentication
    await authService.initialize(this.config.authConfig);
  }
}
