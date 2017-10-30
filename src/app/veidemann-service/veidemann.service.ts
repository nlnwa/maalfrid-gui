import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrawlJob, Entity, Seed} from '../commons/models/config.model';
import {ListReply} from '../commons/models/controller.model';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import {createQueryParams} from '../commons/util';

@Injectable()
export class VeidemannService {

  private readonly URL = environment.VEIDEMANN_API_GATEWAY_URL;

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
