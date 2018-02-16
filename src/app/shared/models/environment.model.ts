import {environment} from '../../../environments/environment';

export class AuthConfig {
  issuer: string;
  requireHttps: boolean;
  redirectUri: string;
  clientId: string;
  scope: string;

  constructor(auth: AuthConfig = {} as AuthConfig) {
    const {
      issuer = environment.auth.issuer,
      requireHttps = environment.auth.requireHttps,
      redirectUri = environment.auth.redirectUri,
      clientId = environment.auth.clientId,
      scope = environment.auth.scope,
    } = auth;
    this.issuer = issuer;
    this.requireHttps = requireHttps;
    this.redirectUri = redirectUri;
    this.clientId = clientId;
    this.scope = scope;
  }
}

export class Environment {
  auth: AuthConfig;
  apiGateway: string;
  maalfridApiGateway: string;

  constructor(env: Environment = {} as Environment) {
    if (env.hasOwnProperty('auth')) {
      env.auth = new AuthConfig(env.auth);
    }
    const {
      auth = environment.auth,
      apiGateway = environment.apiGateway,
      maalfridApiGateway = environment.maalfridApiGateway,
    } = env;
    this.auth = auth;
    this.apiGateway = apiGateway;
    this.maalfridApiGateway = maalfridApiGateway;
  }
}
