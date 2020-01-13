import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AggregateText, CrawlJob, createQueryParams, Entity, FilterSet, Label, MaalfridReply, Reply, Seed} from '../../../shared/';

import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Interval} from '../../../explore/components/interval/interval.component';
import {endOfYear, setYear, startOfDay, startOfYear} from 'date-fns';
import {AppConfigService} from '../app.config.service';
import {depTrans} from '../../../../assets/departments';
import {ConfigPromiseClient} from '../../../../api/gen/config/v1/config_grpc_web_pb';

const ENTITY_NAME_NN_LABEL_KEY = 'name-locale-nn';
const DEPARTMENT_LABEL_KEY = 'departement-org.nr';


@Injectable()
export class MaalfridService {

  private readonly apiUrl: string;
  private cache = {
    statistics: new Map(),
    entities: undefined,
    seeds: undefined,
  };
  private configPromiseClient: ConfigPromiseClient;

  constructor(private http: HttpClient,
              private appConfigService: AppConfigService,
              @Inject(LOCALE_ID) public locale: string) {
    this.configPromiseClient = new ConfigPromiseClient(appConfigService.grpcWebUrl, null, null);
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
    return this.http.get<MaalfridReply>(`${this.appConfigService.apiUrl}/executions`, {params})
      .pipe(map(reply => reply.value || []));
  }

  getEntities(): Observable<Entity[]> {
    if (this.cache.entities) {
      return of(this.cache.entities);
    }
    return this.http.get<{ value: any[] }>(this.appConfigService.apiUrl + '/entities')
      .pipe(
        map(reply => reply.value || []),
        map((entities) => entities.length === 0
          ? entities
          : entities.filter(entity => !!entity.meta.label).map((entity: Entity) => {
            const departmentLabel: Label = entity.meta.label.find((label: Label) => label.key === DEPARTMENT_LABEL_KEY);
            const departmentOrgNr = departmentLabel ? departmentLabel.value : '0';
            const translations = depTrans[departmentOrgNr] || depTrans[0];
            entity.meta.department = translations[this.locale];
            if (this.locale === 'nn') {
              const entityNameNNLabel: Label = entity.meta.label.find((label: Label) => label.key === ENTITY_NAME_NN_LABEL_KEY);
              if (entityNameNNLabel !== undefined) {
                entity.meta.name = entityNameNNLabel.value;
              }
            }
            return entity;
          })
        )
      );
  }

  getSeedsOfEntity(entityId: string): Observable<Seed[]> {
    if (!entityId) {
      return of([]);
    }
    const params = createQueryParams({entity_id: entityId});

    return this.http.get<{ value }>(this.appConfigService.apiUrl + '/seeds', {params})
      .pipe(map(reply => reply.value || []));
  }

  getSeeds(): Observable<Seed[]> {
    if (this.cache.seeds) {
      return of(this.cache.seeds);
    }
    return this.http.get<{ value }>(this.appConfigService.apiUrl + '/seeds')
      .pipe(
        map(reply => reply.value || []),
        tap(value => this.cache.seeds = value),
      );
  }

  getText(warcId: string): Observable<string> {
    const params = createQueryParams({warc_id: warcId});
    return this.http.get<Reply<string>>(this.appConfigService.apiUrl + '/text', {params})
      .pipe(map((reply) => reply.value || ''));
  }

  identifyLanguage(text: string): Observable<{ value: any }> {
    return this.http.post<{ value: any }>(this.appConfigService.apiUrl + '/action/detect-language', {text});
  }

  getFilterSetById(id: string): Observable<FilterSet> {
    return this.http.get<Reply<FilterSet>>(this.appConfigService.apiUrl + '/filter/' + id)
      .pipe(map((reply) => reply.value));
  }

  getFilterSetsBySeedId(seedId): Observable<FilterSet[]> {
    if (!seedId) {
      return of([]);
    }
    const params = createQueryParams({seed_id: seedId});
    return this.http.get<Reply<FilterSet[]>>(this.appConfigService.apiUrl + '/filter', {params})
      .pipe(map((reply) => reply.value));
  }

  createFilter(filterSet: FilterSet): Observable<any> {
    return this.http.put(this.appConfigService.apiUrl + '/filter', filterSet);
  }

  saveFilter(filterSet: FilterSet): Observable<any> {
    return this.http.post(this.appConfigService.apiUrl + '/filter', filterSet);
  }

  deleteFilter(filterSet: FilterSet): Observable<any> {
    return this.http.delete(this.appConfigService.apiUrl + '/filter/' + filterSet.id);
  }

  applyFilter(seedId: string, startTime: string, endTime: string): Observable<any> {
    const params = Object.assign({},
      seedId ? {seed_id: seedId} : {},
      startTime ? {start_time: startTime} : {},
      endTime ? {end_time: endTime} : {}
    );
    return this.http.post(this.appConfigService.apiUrl + '/action/apply-filters', params);
  }

  getStatisticByYear(year: number, entityId?: string): Observable<any[]> {
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

  getStatisticsInterval(startTime: Date, endTime: Date, entityId?: string): Observable<any> {
    const startTimeStr = startTime.toISOString();
    const endTimeStr = endTime.toISOString();
    const params = createQueryParams(
      Object.assign({start_time: startTimeStr, end_time: endTimeStr}, entityId ? {entity_id: entityId} : {}));
    return this.http.get<Reply<any[]>>(this.appConfigService.apiUrl + '/statistics', {params})
      .pipe(
        map((reply) => reply.value),
      );
  }
}
