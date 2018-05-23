import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {createQueryParams} from '../../shared/http/util';
import {AppConfig} from '../../app.config';
import {AggregateExecution, MaalfridReply} from '../../shared/models/maalfrid.model';
import {Entity, Seed} from '../../shared/models/config.model';
import {ListReply} from '../../shared/models/controller.model';

import {Observable} from 'rxjs/index';
import {map} from 'rxjs/operators';

@Injectable()
export class MaalfridService {

  private readonly apiUrl: string;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getExecutions(query): Observable<AggregateExecution[]> {
    const params = createQueryParams(query);

    return this.http.get<MaalfridReply>(`${this.apiUrl}/executions`, {params})
      .pipe(map(reply => reply.value || []));
  }

  getStatistic(query): Observable<any[]> {
    const params = createQueryParams(query);

    return this.http.get<MaalfridReply>(`${this.apiUrl}/statistic`, {params})
      .pipe(map(reply => reply.value || []));
  }

  getEntities(): Observable<Entity[]> {
    return this.http.get<ListReply<Entity>>(this.apiUrl + '/entities')
      .pipe(map(reply => reply.value || []));
  }

  getSeeds(entity: Entity): Observable<Seed[]> {
    const params = createQueryParams({entity_id: entity.id});

    return this.http.get<ListReply<Seed>>(this.apiUrl + '/seeds', {params})
      .pipe(map(reply => reply.value || []));
  }

  getText(warcId: string): Observable<string> {
    const params = createQueryParams({warc_id: warcId});
    return this.http.get(this.apiUrl + '/text', {params})
      .pipe(map((reply) => reply['value'] || ''));
  }

  identifyLanguage(text: string): Observable<Object> {
    return this.http.post(this.apiUrl + '/detect', {value: text});
  }
}
