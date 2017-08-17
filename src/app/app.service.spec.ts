import { TestBed, inject } from '@angular/core/testing';

import { AppService } from './app.service';

describe('AppserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService]
    });
  });

  it('should ...', inject([AppService], (service: AppService) => {
    expect(service).toBeTruthy();
  }));
});
