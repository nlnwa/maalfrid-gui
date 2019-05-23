import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegexpComponent} from './regexp.component';
import {MaterialModule} from '../../../shared/material.module';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('RegexpComponent', () => {
  let component: RegexpComponent;
  let fixture: ComponentFixture<RegexpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegexpComponent],
      imports: [MaterialModule, FormsModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegexpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
