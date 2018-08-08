import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {createQueryParams} from '../../shared/http/util';
import {AppConfig} from '../../app.config';
import {AggregateText, MaalfridReply, Reply} from '../../shared/models/maalfrid.model';
import {CrawlJob, Entity, Seed} from '../../shared/models/config.model';
import {ListReply} from '../../shared/models/controller.model';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Interval} from '../interval/interval.component';

@Injectable()
export class MaalfridService {

  private readonly apiUrl: string;
  private readonly defaultFilter = {language: ['NOB', 'NNO']};

  constructor(private http: HttpClient, private appConfig: AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getExecutions(seed: Seed, interval: Interval, job?: CrawlJob): Observable<AggregateText[]> {
    const params = createQueryParams({
      seed_id: seed.id,
      job_id: job ? job.id : '',
      start_time: interval.start
        .startOf('day')
        .toJSON(),
      end_time: interval.end
        .startOf('day')
        .toJSON(),
    });

    return this.http.get<MaalfridReply>(`${this.apiUrl}/executions`, {params})
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
    return this.http.get<Reply>(this.apiUrl + '/text', {params})
      .pipe(map((reply) => reply.value || ''));
  }

  identifyLanguage(text: string): Observable<Object> {
    return this.http.post(this.apiUrl + '/detect', {value: text});
  }

  getFilter(seeds: Seed[]): Observable<object> {
    const params = createQueryParams({seed_id: seeds.map(_ => _.id)});
    return this.http.get<Reply>(this.apiUrl + '/filter', {params}).pipe(
      map((reply) => reply.value || {filter: {...this.defaultFilter}}),
    );
  }

  saveFilter(seed: Seed, filter: object): Observable<any> {
    return this.http.post(this.apiUrl + '/filter', {seed_id: seed.id, filter});
  }
}
