import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrawlJob, Entity, Seed} from '../../shared/models/config.model';
import {ListReply} from '../../shared/models/controller.model';
import {environment} from '../../../environments/environment';
import 'rxjs/add/operator/map';
import {createQueryParams} from '../../shared/http/util';

@Injectable()
export class VeidemannService {

  private readonly URL = environment.apiGateway;

  constructor(private http: HttpClient) { }

  getEntities(query) {
    const params = createQueryParams(query);
    return this.http.get<ListReply<Entity>>(this.URL + '/entities', {params})
      .map(reply => reply.value);
  }

  getSeeds(entity: Entity) {
    const params = createQueryParams({entity_id: entity.id});
    return this.http.get<ListReply<Seed>>(this.URL + '/seeds', {params})
      .map(reply => reply.value);
  }

  getCrawlJobs() {
    return this.http.get<ListReply<CrawlJob>>(this.URL + '/crawljobs')
      .map(reply => reply.value);
  }
}
