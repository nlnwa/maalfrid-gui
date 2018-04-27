import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker/typings/datepicker-input';
import {Moment} from 'moment';
import * as moment from 'moment';

export class Interval {
  start: Moment;
  end: Moment;
}

@Component({
  selector: 'app-interval',
  template: `
    <style>
      .interval-container {
        height: 100%;
      }
    </style>
    <section class="interval-container" fxLayout="column">
      <mat-toolbar class="app-toolbar" color="primary">
        <mat-icon class="icon-header">schedule</mat-icon>
        Intervall
      </mat-toolbar>
      <div class="container" fxLayout="column">
        <mat-input-container>
          <input matInput
                 [ngModel]="interval.start"
                 [matDatepicker]="startTime"
                 placeholder="Start"
                 (dateChange)="onStartDateChange($event)">
          <mat-datepicker-toggle matSuffix [for]="startTime"></mat-datepicker-toggle>
        </mat-input-container>
        <mat-datepicker #startTime [startView]="startView"></mat-datepicker>
        <mat-input-container>
          <input matInput
                 [ngModel]="interval.end"
                 [matDatepicker]="endTimePicker"
                 placeholder="Slutt"
                 (dateChange)="onEndDateChange($event)">
          <mat-datepicker-toggle matSuffix [for]="endTimePicker"></mat-datepicker-toggle>
        </mat-input-container>
        <mat-datepicker #endTimePicker [startView]="startView"></mat-datepicker>
      </div>
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalComponent implements OnInit {

  @Output()
  intervalSet = new EventEmitter<Interval>();

  startView = 'year';

  interval: Interval = {
    start: moment().startOf('year'),
    end: moment().endOf('month'),
  };


  ngOnInit(): void {
    this.intervalSet.emit(this.interval);
  }

  onStartDateChange(event: MatDatepickerInputEvent<Moment>) {
    this.interval.start = event.value;
    this.intervalSet.emit(this.interval);
  }

  onEndDateChange(event: MatDatepickerInputEvent<Moment>) {
    this.interval.end = event.value;
    this.intervalSet.emit(this.interval);
  }
}
