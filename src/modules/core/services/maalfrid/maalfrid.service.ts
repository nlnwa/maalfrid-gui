import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AggregateText, CrawlJob, createQueryParams, Entity, FilterSet, ListReply, MaalfridReply, Reply, Seed} from '../../../shared/';

import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Interval} from '../../../explore/components/interval/interval.component';
import {endOfMonth, endOfYear, setMonth, setYear, startOfDay, startOfMonth, startOfYear} from 'date-fns';
import {AppConfigService} from '../app.config.service';

@Injectable()
export class MaalfridService {

  private readonly apiUrl: string;
  private cache = {
    statistics: new Map(),
    entities: undefined,
    seeds: undefined,
  };

  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.apiUrl = appConfigService.apiUrl;
  }

  getExecutions(seed: Seed, interval?: Interval, job?: CrawlJob): Observable<AggregateText[]> {
    if (!seed) {
      return of([]);
    }
    const params = createQueryParams({
      seed_id: seed.id,
      job_id: job ? job.id : '',
      start_time: interval ? interval.start ? startOfDay(interval.start).toJSON() : '' : startOfYear(new Date()).toJSON(),
      end_time: interval ? interval.end ? startOfDay(interval.end).toJSON() : '' : endOfYear(new Date()).toJSON(),
    });
    return this.http.get<MaalfridReply>(`${this.apiUrl}/executions`, {params})
      .pipe(map(reply => reply.value || []));
  }

  getEntities(): Observable<Entity[]> {
    if (this.cache.entities) {
      return of(this.cache.entities);
    }
    return this.http.get<ListReply<Entity>>(this.apiUrl + '/entities')
      .pipe(
        map(reply => reply.value || []),
        tap((value => this.cache.entities = value)),
      );
  }

  getSeedsOfEntity(entityId: string): Observable<Seed[]> {
    if (!entityId) {
      return of([]);
    }
    const params = createQueryParams({entity_id: entityId});

    return this.http.get<ListReply<Seed>>(this.apiUrl + '/seeds', {params})
      .pipe(map(reply => reply.value || []));
  }

  getSeeds(): Observable<Seed[]> {
    if (this.cache.seeds) {
      return of(this.cache.seeds);
    }
    return this.http.get<ListReply<Seed>>(this.apiUrl + '/seeds')
      .pipe(
        map(reply => reply.value || []),
        tap(value => this.cache.seeds = value),
      );
  }

  getText(warcId: string): Observable<string> {
    const params = createQueryParams({warc_id: warcId});
    return this.http.get<Reply<string>>(this.apiUrl + '/text', {params})
      .pipe(map((reply) => reply.value || ''));
  }

  identifyLanguage(text: string): Observable<Object> {
    return this.http.post(this.apiUrl + '/action/detect-language', {text});
  }

  getFilterSetById(id: string): Observable<FilterSet> {
    return this.http.get<Reply<FilterSet>>(this.apiUrl + '/filter/' + id)
      .pipe(map((reply) => reply.value));
  }

  getFilterSetsBySeedId(seedId): Observable<FilterSet[]> {
    if (!seedId) {
      return of([]);
    }
    const params = createQueryParams({seed_id: seedId});
    return this.http.get<Reply<FilterSet[]>>(this.apiUrl + '/filter', {params})
      .pipe(map((reply) => reply.value));
  }

  createFilter(filterSet: FilterSet): Observable<any> {
    return this.http.put(this.apiUrl + '/filter', filterSet);
  }

  saveFilter(filterSet: FilterSet): Observable<any> {
    return this.http.post(this.apiUrl + '/filter', filterSet);
  }

  deleteFilter(filterSet: FilterSet): Observable<any> {
    return this.http.delete(this.apiUrl + '/filter/' + filterSet.id);
  }

  applyFilter(seedId: string, startTime: string, endTime: string): Observable<any> {
    const params = Object.assign({},
      seedId ? {seed_id: seedId} : {},
      startTime ? {start_time: startTime} : {},
      endTime ? {end_time: endTime} : {}
    );
    return this.http.post(this.apiUrl + '/action/apply-filters', params);
  }

  getStatistics(year: number, entityId?: string): Observable<any[]> {
    if (this.cache.statistics.has(year + entityId)) {
      return of(this.cache.statistics.get(year + entityId));
    } else {
      const time = setYear(new Date(), year);
      const startTime = startOfYear(time);
      const endTime = endOfYear(time);
      return this.getStatisticsInterval(startTime, endTime, entityId).pipe(
        tap(value => this.cache.statistics.set(year + entityId, value))
      );
    }
  }

  /**
   *
   * @param month 0-11
   * @param entityId
   */
  getStatisticsForMonth(time: Date, entityId?: string): Observable<any> {
    const startTime = startOfMonth(time);
    const endTime = endOfMonth(time);
    return this.getStatisticsInterval(startTime, endTime, entityId);
  }

  getStatisticsInterval(startTime: Date, endTime: Date, entityId?: string): Observable<any> {
    const start_time = startTime.toISOString();
    const end_time = endTime.toISOString();
    const params = createQueryParams(
      Object.assign({start_time, end_time}, entityId ? {entity_id: entityId} :  {}));
    return this.http.get<Reply<any[]>>(this.apiUrl + '/statistics', {params})
      .pipe(
        map((reply) => reply.value),
      );
  }
}
