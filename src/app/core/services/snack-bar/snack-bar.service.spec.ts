import {inject, TestBed} from '@angular/core/testing';
import {SnackBarService} from './snack-bar.service';
import {MaterialModule} from '../../../shared/material.module';

describe('SnackBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnackBarService],
      imports: [MaterialModule]
    });
  });

  it('should be created', inject([SnackBarService], (service: SnackBarService) => {
    expect(service).toBeTruthy();
  }));
});
