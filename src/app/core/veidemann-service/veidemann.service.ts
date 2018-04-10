import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrawlJob, Entity, Seed} from '../../shared/models/config.model';
import {ListReply} from '../../shared/models/controller.model';
import {createQueryParams} from '../../shared/http/util';
import 'rxjs/add/operator/map';
import {AppConfig} from '../../app.config';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class VeidemannService {

  private readonly URL = this.appConfig.environment.apiGatewayUrl;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  getEntities(query): Observable<Entity[]> {
    const params = createQueryParams({...query, page_size: 300});
    return this.http.get<ListReply<Entity>>(this.URL + '/control/entities', {params})
      .map(reply => reply.value || []);
  }

  getSeeds(entity: Entity): Observable<Seed[]> {
    const params = createQueryParams({entity_id: entity.id});
    return this.http.get<ListReply<Seed>>(this.URL + '/control/seeds', {params})
      .map(reply => reply.value || []);
  }

  getCrawlJobs(): Observable<CrawlJob[]> {
    return this.http.get<ListReply<CrawlJob>>(this.URL + '/control/crawljobs')
      .map(reply => reply.value || []);
  }


}
