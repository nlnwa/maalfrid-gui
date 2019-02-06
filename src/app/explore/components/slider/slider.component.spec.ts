import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SliderComponent} from './slider.component';
import {MaterialModule} from '../../../shared/material.module';
import {NouisliderModule} from '../../../nouislider/ng2-nouislider';
import {FormsModule} from '@angular/forms';

describe('SliderFilterComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderComponent],
      imports: [MaterialModule, NouisliderModule, FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
