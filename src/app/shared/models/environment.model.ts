import {AuthConfig} from 'angular-oauth2-oidc/auth.config';
import {environment} from '../../../environments/environment';

export class Environment {
  apiGatewayUrl: string;
  apiUrl: string;
  authConfig: AuthConfig;
  configUrl: string;

  constructor() {
    Object.assign(this, environment);
  }
}
