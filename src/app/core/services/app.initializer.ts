import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth/';
import {IdpReply} from '../../shared/models';
import {map, switchMap} from 'rxjs/operators';

@Injectable()
export class AppInitializer {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  /**
   * Initialize app:
   *  - get idp issuer from controller and initialize auth
   *
   * @returns {Promise<any>}
   */
  async load() {
    return this.http.get<IdpReply>(environment.apiGatewayUrl + '/control/idp')
      .pipe(
        map(reply => reply.open_id_connect_issuer || ''),
        switchMap(issuer => this.authService.initialize(issuer))
      ).toPromise();
  }
}
