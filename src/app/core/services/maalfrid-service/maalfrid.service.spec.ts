import { TestBed, inject } from '@angular/core/testing';

import { MaalfridService } from './maalfrid-service.service';

describe('MaalfridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaalfridService]
    });
  });

  it('should be created', inject([MaalfridService], (service: MaalfridService) => {
    expect(service).toBeTruthy();
  }));
});
