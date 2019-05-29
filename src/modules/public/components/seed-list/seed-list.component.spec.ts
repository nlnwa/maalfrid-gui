import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SeedListComponent} from './seed-list.component';
import {MaterialModule} from '../../../shared/material.module';
import {SeedStatistic} from '../../../shared/models';
import {SimpleChange} from '@angular/core';

describe('SeedListComponent', () => {
  let component: SeedListComponent;
  let fixture: ComponentFixture<SeedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeedListComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedListComponent);
    component = fixture.componentInstance;

    const testSeeds = [];
    for (let i = 0; i < 100; i++) {
      const seed: SeedStatistic = {
        uri: 'http://www.test.no',
        nbPercentage: 72,
        nnPercentage: 28
      };
     testSeeds.push(seed);
    }

    component.seeds = testSeeds;

    component.ngOnChanges({
      seeds: new SimpleChange(null, component.seeds, true)
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
