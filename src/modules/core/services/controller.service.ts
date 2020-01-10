import {ControllerPromiseClient} from '../../../api/gen/controller/v1/controller_grpc_web_pb';
import {AppConfigService} from './app.config.service';
import {AuthService} from './auth';
import {Injectable} from '@angular/core';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
import {defer, from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ControllerService {

  private controllerPromiseClient: ControllerPromiseClient;

  constructor(private authService: AuthService,
              private appConfig: AppConfigService) {
    this.controllerPromiseClient = new ControllerPromiseClient(appConfig.grpcWebUrl, null, null);
  }

  getOpenIdConnectIssuer(): Promise<string> {
    return this.controllerPromiseClient.getOpenIdConnectIssuer(new Empty())
      .then(response => response.getOpenIdConnectIssuer());
  }

  getRolesForActiveUser(): Observable<any[]> {
    return defer(() => from(this.controllerPromiseClient.getRolesForActiveUser(new Empty(), this.authService.metadata)))
      .pipe(map(roleList => roleList.getRoleList()));
  }
}
