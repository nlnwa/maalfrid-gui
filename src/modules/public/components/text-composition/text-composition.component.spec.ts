import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextCompositionComponent} from './text-composition.component';
import {MaterialModule} from '../../../shared/material.module';

describe('TextCompositionComponent', () => {
  let component: TextCompositionComponent;
  let fixture: ComponentFixture<TextCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextCompositionComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextCompositionComponent);
    component = fixture.componentInstance;

    component.textCount = {
      nbLongCount: 27,
      nnLongCount: 11,
      nbShortCount: 78,
      nnShortCount: 41
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
