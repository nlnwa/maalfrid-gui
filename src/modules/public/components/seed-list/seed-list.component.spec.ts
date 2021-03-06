import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SeedListComponent} from './seed-list.component';
import {MaterialModule} from '../../../shared/material.module';
import {SeedStatistic} from '../../../shared/models';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('SeedListComponent', () => {
  let component: SeedListComponent;
  let fixture: ComponentFixture<SeedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeedListComponent],
      imports: [MaterialModule, NoopAnimationsModule]
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
        nnPercentage: 28,
        id: 'abcd-efgh',
        primary: true
      };
      testSeeds.push(seed);
    }

    component.seeds = testSeeds;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
