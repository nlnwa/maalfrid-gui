import {TestBed} from '@angular/core/testing';

import {EntityResolverService} from './entity-resolver.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {MaalfridService} from '../../core/services';

describe('EntityResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EntityResolverService,
      {
        provide: MaalfridService,
        useValue: {
          getEntities: () => of([])
        }
      }
    ],
    imports: [RouterTestingModule]
  }));

  it('should be created', () => {
    const service: EntityResolverService = TestBed.get(EntityResolverService);
    expect(service).toBeTruthy();
  });
});
