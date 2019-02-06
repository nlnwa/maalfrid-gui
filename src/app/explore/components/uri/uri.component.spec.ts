import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UriComponent} from './uri.component';
import {MaterialModule} from '../../../shared/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('UriComponent', () => {
  let component: UriComponent;
  let fixture: ComponentFixture<UriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UriComponent],
      imports: [MaterialModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
