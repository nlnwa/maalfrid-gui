import { TestBed, inject } from '@angular/core/testing';

import { VeidemannService } from './veidemann.service';

describe('VeidemannService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VeidemannService]
    });
  });

  it('should be created', inject([VeidemannService], (service: VeidemannService) => {
    expect(service).toBeTruthy();
  }));
});
