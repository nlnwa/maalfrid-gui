import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EntityListComponent} from './entity-list.component';
import {MaterialModule} from '../../../shared/material.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Entity, Meta} from '../../../shared/models';
import {SimpleChange} from '@angular/core';

describe('EntityListComponent', () => {
  let component: EntityListComponent;
  let fixture: ComponentFixture<EntityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityListComponent],
      imports: [MaterialModule, NoopAnimationsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityListComponent);
    component = fixture.componentInstance;

    component.entities = [
      {
        meta: {
          name: 'TestEntity',
          description: 'A test entity for testing purposes'
        } as Meta
      } as Entity,
      {
        meta: {
          name: 'An entity',
          description: '123 abc'
        } as Meta
      } as Entity
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
