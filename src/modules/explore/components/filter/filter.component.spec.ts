import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterComponent} from './filter.component';
import {ExploreModule} from '../../explore.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ExploreModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
