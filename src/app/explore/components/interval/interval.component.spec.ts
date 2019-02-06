import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterialModule} from '../../../shared/material.module';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {IntervalComponent} from './interval.component';
import {DateFnsDateAdapter, MAT_DATE_FNS_DATE_FORMATS} from '../../../shared/date-fns-date-adapter';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material';

describe('IntervalComponent', () => {
  let component: IntervalComponent;
  let fixture: ComponentFixture<IntervalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntervalComponent],
      imports: [MaterialModule, FormsModule, NoopAnimationsModule],
      providers: [
        DateFnsDateAdapter,
        DateAdapter,
        {provide: DateAdapter, useClass: DateFnsDateAdapter},
        {
          provide: MAT_DATE_FORMATS,
          useValue: MAT_DATE_FNS_DATE_FORMATS
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
