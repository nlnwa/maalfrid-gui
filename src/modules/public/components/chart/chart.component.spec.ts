import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartComponent} from './chart.component';
import {MaterialModule} from '../../../shared/material.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {WorkerService} from '../../../explore/services';

fdescribe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [MaterialModule, NgxChartsModule],
      providers: [WorkerService]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ChartComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.autoDetectChanges();
  });
});
