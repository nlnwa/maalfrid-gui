import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

import {SelectionModel} from '@angular/cdk/collections';
import {Filter, FilterSet} from '../../models/maalfrid.model';


@Component({
  selector: 'app-filter-set',
  template: `
    <style>
      section {
        height: 100%;
      }

      .table {
        height: 100%;
        overflow-y: auto;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column" [fxHide]="!show">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon>{{ icon }}</mat-icon>&nbsp;{{ name }}
      </mat-toolbar>


      <mat-table class="table" [dataSource]="dataSource" matSort>

        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>Navn</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="field">
          <mat-header-cell *matHeaderCellDef>Felt</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.field }}</mat-cell>
        </ng-container>


        <ng-container matColumnDef="exclusive">
          <mat-header-cell *matHeaderCellDef>Eksluderende</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.exlusive ? 'Ja' : '' }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="value">
          <mat-header-cell *matHeaderCellDef>Verdi</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.value }}</mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>

        <mat-row *matRowDef="let row; columns: displayedColumns"
                 [ngClass]="{'highlight': selection.isSelected(row)}"
                 (click)="onRowClick(row)">
        </mat-row>
      </mat-table>
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSetComponent implements OnChanges {
  displayedColumns = ['name', 'field', 'exclusive', 'value'];
  dataSource: MatTableDataSource<Filter>;
  selection = new SelectionModel<Filter>(true, []);

  @Input()
  filterSet: FilterSet;

  @Output()
  rowClick = new EventEmitter<Filter[]>();

  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  get name(): string {
    if (this.filterSet) {
      if (this.filterSet.id === 'global') {
        return 'Globale filtre';
      } else {
        return 'Seed filtre';
      }
    } else {
      return '';
    }
  }

  get show(): boolean {
    return this.filterSet !== null;
  }

  get icon(): string {
    return this.filterSet && this.filterSet.id === 'global' ? '360' : 'trip_origin';
  }

  get filters(): Filter[] {
    return this.filterSet ? this.filterSet.filters : [];
  }

  onRowClick(filter) {
    this.selection.toggle(filter);
    if (this.selection.hasValue()) {
      this.rowClick.emit(this.selection.selected);
    } else {
      this.rowClick.emit([]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterSet && this.filterSet) {
      this.dataSource.data = this.filterSet.filters;
      if (this.filters.length > 0) {
        this.selection.select(...this.filters);
        this.rowClick.emit(this.selection.selected);
      } else {
        this.rowClick.emit([]);
      }
    }
  }
}


