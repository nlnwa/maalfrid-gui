import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatDatepickerInputEvent, MatTableDataSource} from '@angular/material';

import {SelectionModel} from '@angular/cdk/collections';
import {FilterSet} from '../../models/maalfrid.model';
import {Moment} from 'moment';


@Component({
  selector: 'app-filter-set-list',
  template: `
    <style>
      section {
        height: 100%;
      }

      table {
        width: 100%;
      }

      .select {
        padding-right: 1rem;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon>filter</mat-icon>&nbsp;Liste over filtersett
        <span fxFlex></span>
        <button mat-icon-button [disabled]="!selection.hasValue()" (click)="onDelete()">
          <mat-icon>delete</mat-icon>
        </button>
        <button mat-icon-button (click)="onCreate()">
          <mat-icon>add</mat-icon>
        </button>
      </mat-toolbar>
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="select">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row" class="select">
            <mat-checkbox color="primary" (click)="$event.stopPropagation()"
                          (change)="onCheckboxToggle(row)"
                          [checked]="selection.isSelected(row)">
            </mat-checkbox>
          </td>
        </ng-container>
        <ng-container matColumnDef="validFrom">
          <th mat-header-cell *matHeaderCellDef>Gyldig fra</th>
          <td mat-cell
              *matCellDef="let row">
            <mat-form-field>
              <input matInput [matDatepicker]="startTimePicker" (dateChange)="onStartDateChange($event, row)" [ngModel]="row.validFrom">
              <mat-datepicker-toggle matSuffix [for]="startTimePicker"></mat-datepicker-toggle>
              <mat-datepicker #startTimePicker></mat-datepicker>
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="validTo">
          <th mat-header-cell *matHeaderCellDef>Gyldig til</th>
          <td mat-cell *matCellDef="let row">
            <mat-form-field>
              <input matInput [matDatepicker]="endTimePicker" (dateChange)="onEndDateChange($event, row)" [ngModel]="row.validTo">
              <mat-datepicker-toggle matSuffix [for]="endTimePicker"></mat-datepicker-toggle>
              <mat-datepicker #endTimePicker></mat-datepicker>
            </mat-form-field>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"
            [ngClass]="{'highlight': selection.isSelected(row)}">
        </tr>
      </table>
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSetListComponent implements OnChanges {
  displayedColumns = ['select', 'validFrom', 'validTo'];
  dataSource: MatTableDataSource<FilterSet>;
  selection = new SelectionModel<FilterSet>(false, []);

  @Input()
  filterSets: FilterSet[] = [];

  @Output()
  rowClick = new EventEmitter<FilterSet>();

  @Output()
  create = new EventEmitter<void>();

  @Output()
  save = new EventEmitter<FilterSet>();

  @Output()
  delete = new EventEmitter<FilterSet>();

  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  get visible(): boolean {
    return this.filterSets && this.filterSets.length > 0;
  }

  get name(): string {
    return this.selected ? this.selected.validFrom : '';
  }

  get selected(): FilterSet {
    return this.selection.hasValue() ? this.selection.selected[0] : null;
  }

  onCheckboxToggle(filterSet) {
    this.selection.toggle(filterSet);
    if (this.selection.hasValue()) {
      this.rowClick.emit(filterSet);
    } else {
      this.rowClick.emit(null);
    }
  }

  onStartDateChange(event: MatDatepickerInputEvent<Moment>, filterSet: FilterSet) {
    if (event.value) {
      filterSet.validTo = event.value.toISOString();
    } else {
      delete filterSet.validTo;
    }
    this.save.emit(filterSet);
  }

  onEndDateChange(event: MatDatepickerInputEvent<Moment>, filterSet) {
    if (event.value) {
      filterSet.validFrom = event.value.toISOString();
    } else {
      delete filterSet.validFrom;
    }
    this.save.emit(filterSet);
  }

  onCreate() {
    this.create.emit();
  }

  onDelete() {
    if (this.selection.hasValue()) {
      this.delete.emit(this.selection.selected[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterSets && this.filterSets) {
      this.dataSource.data = this.filterSets;
      if (this.filterSets.length > 0) {
        this.onCheckboxToggle(this.filterSets[0]);
      } else {
        this.rowClick.emit(null);
      }
    }
  }
}


