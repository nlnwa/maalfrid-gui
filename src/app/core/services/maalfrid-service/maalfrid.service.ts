import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {createQueryParams} from '../../../shared/http/util';
import {AppConfig} from '../../../app.config';
import {AggregateText, FilterSet, MaalfridReply, Reply} from '../../models/maalfrid.model';
import {CrawlJob, Entity, Seed} from '../../models/config.model';
import {ListReply} from '../../../shared/models/controller.model';

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Interval} from '../../components/interval/interval.component';

@Injectable()
export class MaalfridService {

  private readonly apiUrl: string;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  getExecutions(seed: Seed, interval: Interval, job?: CrawlJob): Observable<AggregateText[]> {
    const params = createQueryParams({
      seed_id: seed.id,
      job_id: job ? job.id : '',
      start_time: interval.start
        ? interval.start
          .startOf('day')
          .toJSON()
        : '',
      end_time: interval.end
        ? interval.end
          .startOf('day')
          .toJSON()
        : '',
    });
    return this.http.get<MaalfridReply>(`${this.apiUrl}/executions`, {params})
      .pipe(map(reply => reply.value || []));
  }

  getEntities(): Observable<Entity[]> {
    return this.http.get<ListReply<Entity>>(this.apiUrl + '/entities')
      .pipe(map(reply => reply.value || []));
  }

  getSeeds(entity: Entity): Observable<Seed[]> {
    if (!entity) {
      return of([]);
    }
    const params = createQueryParams({entity_id: entity.id});

    return this.http.get<ListReply<Seed>>(this.apiUrl + '/seeds', {params})
      .pipe(map(reply => reply.value || []));
  }

  getText(warcId: string): Observable<string> {
    const params = createQueryParams({warc_id: warcId});
    return this.http.get<Reply<string>>(this.apiUrl + '/text', {params})
      .pipe(map((reply) => reply.value || ''));
  }

  identifyLanguage(text: string): Observable<Object> {
    return this.http.post(this.apiUrl + '/detect', {value: text});
  }

  getFilterById(id: string): Observable<FilterSet> {
    return this.http.get<Reply<FilterSet>>(this.apiUrl + '/filter/' + id)
      .pipe(
        map((reply) => reply.value),
      );
  }

  getFilter(seed: Seed): Observable<FilterSet[]> {
    if (!seed) {
      return of([]);
    }
    const params = createQueryParams({seed_id: seed.id});
    return this.http.get<Reply<FilterSet[]>>(this.apiUrl + '/filter', {params})
      .pipe(
        map((reply) => reply.value),
      );
  }

  saveFilter(filterSet: FilterSet): Observable<any> {
    return this.http.post(this.apiUrl + '/filter', filterSet);
  }
}
