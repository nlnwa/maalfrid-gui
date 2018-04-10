import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/observable/throw';
import {createQueryParams} from '../../shared/http/util';
import {AppConfig} from '../../app.config';
import {MaalfridReply} from '../../shared/models/maalfrid.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MaalfridService {

  private readonly API_URL: string = this.appConfig.environment.apiUrl;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  getExecutions(query): Observable<any[]> {
    const params = createQueryParams(query);
    return this.http.get<MaalfridReply>(`${this.API_URL}/executions`, {params})
      .map(reply => reply.value || []);
  }

  getStatistic(query): Observable<any[]> {
    const params = createQueryParams(query);
    return this.http.get<MaalfridReply>(`${this.API_URL}/statistic`, {params})
      .map(reply => reply.value || []);
  }
}
