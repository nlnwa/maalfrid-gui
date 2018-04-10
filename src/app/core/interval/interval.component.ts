import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker/typings/datepicker-input';

export class Interval {
  start: Moment;
  end: Moment;
}

@Component({
  selector: 'app-interval',
  template: `
    <section>
      <mat-toolbar color="primary">
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
    console.log('init', this.interval);
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
