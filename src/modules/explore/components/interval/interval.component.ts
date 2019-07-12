import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker/typings/datepicker-input';

export class Interval {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-interval',
  template: `
    <style>
      section {
        height: 100%;
      }

      .field {
        width: 100%;
      }
    </style>
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon class="icon-header">schedule</mat-icon>&nbsp;
        Periode
      </mat-toolbar>
      <div fxLayout="column" class="app-content__padding">
        <mat-form-field fxFlex class="field">
          <input matInput
                 [ngModel]="intervalModel.start"
                 [matDatepicker]="startTimePicker"
                 placeholder="Fra"
                 (dateChange)="onStartDateChange($event)">
          <mat-datepicker-toggle matSuffix [for]="startTimePicker"></mat-datepicker-toggle>
        </mat-form-field>
        <mat-datepicker #startTimePicker [startView]="startView"></mat-datepicker>

        <mat-form-field fxFlex class="field">
          <input matInput
                 [ngModel]="intervalModel.end"
                 [matDatepicker]="endTimePicker"
                 placeholder="Til"
                 (dateChange)="onEndDateChange($event)">
          <mat-datepicker-toggle matSuffix [for]="endTimePicker"></mat-datepicker-toggle>
        </mat-form-field>
        <mat-datepicker #endTimePicker [startView]="startView"></mat-datepicker>
      </div>
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalComponent implements AfterViewInit {

  // tslint:disable-next-line:no-output-native
  @Output()
  change = new EventEmitter<Interval>();

  startView = 'year';

  intervalModel: Interval = {
    start: null,
    end: null,
  };


  ngAfterViewInit(): void {
    this.change.emit(this.intervalModel);
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.intervalModel.start = event.value;
    this.change.emit(this.intervalModel);
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    this.intervalModel.end = event.value;
    this.change.emit(this.intervalModel);
  }
}
