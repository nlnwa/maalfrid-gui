import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {Entity} from '../../shared/models';
import {MaalfridService} from './index';

@Injectable()
export class EntityResolverService implements Resolve<Entity[]> {

  constructor(private maalfridService: MaalfridService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Entity[]> | Promise<Entity[]> | Entity[] {
    return this.maalfridService.getEntities().pipe(catchError(() => of([])));
  }
}
