import {inject, TestBed} from '@angular/core/testing';

import {MaalfridService} from './maalfrid.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('MaalfridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MaalfridService,
      ],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([MaalfridService], (service: MaalfridService) => {
    expect(service).toBeTruthy();
  }));
});
