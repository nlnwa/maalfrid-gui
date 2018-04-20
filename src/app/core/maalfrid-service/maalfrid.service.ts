import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/observable/throw';
import {createQueryParams} from '../../shared/http/util';
import {AppConfig} from '../../app.config';
import {MaalfridReply} from '../../shared/models/maalfrid.model';
import {Observable} from 'rxjs/Observable';
import {Entity, Seed} from '../../shared/models/config.model';
import {ListReply} from '../../shared/models/controller.model';

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

  getEntities(): Observable<Entity[]> {
    return this.http.get<ListReply<Entity>>(this.API_URL + '/entities')
      .map(reply => reply.value || []);
  }

  getSeeds(entity: Entity): Observable<Seed[]> {
    const params = createQueryParams({entity_id: entity.id});
    return this.http.get<ListReply<Seed>>(this.API_URL + '/seeds', {params})
      .map(reply => reply.value || []);
  }
}
