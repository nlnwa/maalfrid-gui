import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';

export class Interval {
  start: Moment;
  end: Moment;
}

@Component({
  selector: 'app-interval',
  template: `
    <div>
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
                 (dateChange)="onStartDateChange()">
          <mat-datepicker-toggle matSuffix [for]="startTime"></mat-datepicker-toggle>
        </mat-input-container>
        <mat-datepicker #startTime></mat-datepicker>
        <mat-input-container>
          <input matInput
                 [ngModel]="interval.end"
                 [matDatepicker]="endTimePicker"
                 placeholder="Slutt"
                 (dateChange)="onEndDateChange()">
          <mat-datepicker-toggle matSuffix [for]="endTimePicker"></mat-datepicker-toggle>
        </mat-input-container>
        <mat-datepicker #endTimePicker></mat-datepicker>
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalComponent implements OnInit {

  @Output()
  intervalSet = new EventEmitter<Interval>();

  interval: Interval = {
    start: moment().startOf('month'),
    end: moment().endOf('month'),
  };


  ngOnInit(): void {
    this.intervalSet.emit(this.interval);
  }

  onStartDateChange() {
    this.intervalSet.emit(this.interval);
  }

  onEndDateChange() {
    this.intervalSet.emit(this.interval);
  }
}
