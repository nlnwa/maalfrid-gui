import { TestBed } from '@angular/core/testing';

import { EntityResolverService } from './entity-resolver.service';

describe('EntityResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntityResolverService = TestBed.get(EntityResolverService);
    expect(service).toBeTruthy();
  });
});
