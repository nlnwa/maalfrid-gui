import {Injectable} from '@angular/core';
import {Entity} from '../../shared/models';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {MaalfridService} from '../../core/services';
import {catchError} from 'rxjs/operators';

@Injectable()
export class EntityResolverService implements Resolve<Entity[]> {

  constructor(private maalfridService: MaalfridService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Entity[]> | Promise<Entity[]> | Entity[] {
    return this.maalfridService.getEntities().pipe(catchError(() => of([])));
  }
}
