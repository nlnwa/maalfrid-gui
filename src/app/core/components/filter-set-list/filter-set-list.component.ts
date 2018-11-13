import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

import {SelectionModel} from '@angular/cdk/collections';
import {FilterSet} from '../../models/maalfrid.model';


@Component({
  selector: 'app-filter-set-list',
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
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon>business</mat-icon>&nbsp;Filtersett
      </mat-toolbar>
      <mat-table class="table" [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="valid_from">
          <mat-header-cell *matHeaderCellDef>Gyldig fra</mat-header-cell>
          <mat-cell *matCellDef="let row">
            <span>{{ row.valid_from || "-" }}</span>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="valid_to">
          <mat-header-cell *matHeaderCellDef>Gyldig til</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.valid_to || "-" }}</mat-cell>
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
export class FilterSetListComponent implements OnChanges {
  displayedColumns = ['valid_from', 'valid_to'];
  dataSource: MatTableDataSource<FilterSet>;
  selection = new SelectionModel<FilterSet>(false, []);

  @Input()
  filterSets: FilterSet[] = [];

  @Output()
  rowClick = new EventEmitter<FilterSet>();

  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  get visible(): boolean {
    return this.filterSets && this.filterSets.length > 0;
  }

  get name(): string {
    return this.selected ? this.selected.valid_from : '';
  }

  get selected(): FilterSet {
    return this.selection.hasValue() ? this.selection.selected[0] : null;
  }

  onRowClick(filterSet) {
    this.selection.toggle(filterSet);
    if (this.selection.hasValue()) {
      this.rowClick.emit(filterSet);
    } else {
      this.rowClick.emit(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterSets && this.filterSets) {
      this.dataSource.data = this.filterSets;
      if (this.filterSets.length > 0) {
        this.onRowClick(this.filterSets[0]);
      } else {
        this.rowClick.emit(null);
      }
    }
  }
}


