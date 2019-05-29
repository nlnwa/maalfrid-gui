import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {MaterialModule} from '../../../shared/material.module';
import {EntitySelectorComponent} from '../../components';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Entity} from '../../../shared/models';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, EntitySelectorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              entities: [
                {meta: {name: 'Test', label: []}} as Entity
              ]
            })
          }
        }
      ],
      imports: [ReactiveFormsModule, MaterialModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
