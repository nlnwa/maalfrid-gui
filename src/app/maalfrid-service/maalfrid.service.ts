import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/observable/throw';
import {environment} from '../../environments/environment';
import {HttpUtil} from '../commons/HttpUtil';

@Injectable()
export class MaalfridService {

  private readonly API_URL: string = environment.MAALFRID_API_GATEWAY_URL;

  constructor(private http: HttpClient) {
  }

  setLanguage(query) {
    const params = HttpUtil.getParams(query);
    return this.http.get(
      `${this.API_URL}/detect`,
      {params})
      .timeoutWith(30000, Observable.throw(new Error('Timeout')));
  }

  getStats(query) {
    const params = HttpUtil.getParams(query);
    return this.http.get(`${this.API_URL}/stats`,
      {params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }


  getLang(query) {
    const params = HttpUtil.getParams(query);
    return this.http.get(
      `${this.API_URL}/language`,
      {params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }
}
