import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageCompositionComponent} from './language-composition.component';
import {MaterialModule} from '../../../shared/material.module';


describe('LanguageCompositionComponent', () => {
  let component: LanguageCompositionComponent;
  let fixture: ComponentFixture<LanguageCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageCompositionComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageCompositionComponent);
    component = fixture.componentInstance;

    component.language = {
      nbPercentage: 78,
      nnPercentage: 22
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
