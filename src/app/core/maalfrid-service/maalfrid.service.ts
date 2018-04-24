import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {createQueryParams} from '../../shared/http/util';
import {AppConfig} from '../../app.config';
import {MaalfridReply} from '../../shared/models/maalfrid.model';
import {Entity, Seed} from '../../shared/models/config.model';
import {ListReply} from '../../shared/models/controller.model';

@Injectable()
export class MaalfridService {

  private readonly apiUrl: string;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getExecutions(query): Observable<any[]> {
    const params = createQueryParams(query);
    return this.http.get<MaalfridReply>(`${this.apiUrl}/executions`, {params})
      .map(reply => reply.value || []);
  }

  getStatistic(query): Observable<any[]> {
    const params = createQueryParams(query);
    return this.http.get<MaalfridReply>(`${this.apiUrl}/statistic`, {params})
      .map(reply => reply.value || []);
  }

  getEntities(): Observable<Entity[]> {
    return this.http.get<ListReply<Entity>>(this.apiUrl + '/entities')
      .map(reply => reply.value || []);
  }

  getSeeds(entity: Entity): Observable<Seed[]> {
    const params = createQueryParams({entity_id: entity.id});
    return this.http.get<ListReply<Seed>>(this.apiUrl + '/seeds', {params})
      .map(reply => reply.value || []);
  }
}
