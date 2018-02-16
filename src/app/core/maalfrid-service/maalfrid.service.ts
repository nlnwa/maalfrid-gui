import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/observable/throw';
import {environment} from '../../../environments/environment';
import {createQueryParams} from '../../shared/http/util';

@Injectable()
export class MaalfridService {

  private readonly API_URL: string = environment.maalfridApiGateway;

  constructor(private http: HttpClient) {
  }

  setLanguage(query) {
    const params = createQueryParams(query);
    return this.http.get(
      `${this.API_URL}/detect`,
      {params})
      .timeoutWith(30000, Observable.throw(new Error('Timeout')));
  }

  getExecutions(query) {
    const params = createQueryParams(query);
    return this.http.get(
      `${this.API_URL}/executions`,
      {params})
      .timeoutWith(30000, Observable.throw(new Error('Timeout')));
  }

  getStatistic(query) {
    const params = createQueryParams(query);
    return this.http.get(`${this.API_URL}/statistic`,
      {params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }


  getLang(query) {
    const params = createQueryParams(query);
    return this.http.get(
      `${this.API_URL}/language`,
      {params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }
}
