import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EntitySelectorComponent} from './entity-selector.component';
import {MaterialModule} from '../../../shared/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Entity} from '../../../shared/models';
import {SimpleChange} from '@angular/core';


describe('EntitySelectorComponent', () => {
  let component: EntitySelectorComponent;
  let fixture: ComponentFixture<EntitySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntitySelectorComponent],
      imports: [MaterialModule, ReactiveFormsModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySelectorComponent);
    component = fixture.componentInstance;

    component.entities = [
      {meta: {name: 'En test entitet', label: []}} as Entity
    ];

    component.ngOnChanges({
      entities: new SimpleChange(null, component.entities, true)
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
