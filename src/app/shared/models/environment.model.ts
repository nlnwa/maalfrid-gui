import {AuthConfig} from 'angular-oauth2-oidc/auth.config';

export class Environment {
  authConfig: AuthConfig;
  apiGatewayUrl: string;
  apiUrl: string;

  constructor(env: Environment) {
    Object.assign(this, env);
  }
}
