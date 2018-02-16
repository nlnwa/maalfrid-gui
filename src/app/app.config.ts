import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../environments/environment';
import {AuthService} from './auth';
import {Environment} from './shared/models/environment.model';

@Injectable()
export class AppConfig {

  private _env: Environment;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.environment = environment;
  }

  get environment(): Environment {
    return this._env;
  }

  set environment(env: Environment) {
    this._env = new Environment(env);
  }

  public load(): Promise<any> {
    if (environment.config === '') {
      return Promise.resolve(this.environment)
        .then(env => this.authService.configure(env.auth));
    }
    return this.http.get<Environment>(environment.config).toPromise()
      .then(env => {
        this.environment = env;
        return this.authService.configure(env.auth);
      });
  }
}
