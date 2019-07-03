import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextComponent} from './text.component';
import {MaalfridService} from '../../../core/services';
import {MaterialModule} from '../../../shared/material.module';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextComponent],
      imports: [MaterialModule, FormsModule, NoopAnimationsModule],
      providers: [
        {
          provide: MaalfridService, useValue: {
            getExecutions: () => []
          }
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
