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

      table {
        width: 100%;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column" [fxHide]="!show">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon>{{ icon }}</mat-icon>&nbsp;{{ name }}
        <span fxFlex></span>
        <button mat-icon-button (click)="onSave()">
          <mat-icon>save</mat-icon>
        </button>
      </mat-toolbar>


      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Navn</th>
          <td mat-cell *matCellDef="let row">{{ row.name }}</td>
        </ng-container>

        <ng-container matColumnDef="field">
          <th mat-header-cell *matHeaderCellDef>Felt</th>
          <td mat-cell *matCellDef="let row">{{ row.field }}</td>
        </ng-container>


        <ng-container matColumnDef="exclusive">
          <th mat-header-cell *matHeaderCellDef>Eksluderende</th>
          <td mat-cell *matCellDef="let row">{{ row.exlusive ? 'Ja' : '' }}</td>
        </ng-container>

        <ng-container matColumnDef="value">
          <th mat-header-cell *matHeaderCellDef>Verdi</th>
          <td mat-cell *matCellDef="let row">{{ row.value }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>

        <tr mat-row *matRowDef="let row; columns: displayedColumns"
                 [ngClass]="{'highlight': selection.isSelected(row)}"
                 (click)="onRowClick(row)">
        </tr>
      </table>
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

  @Output()
  save = new EventEmitter<FilterSet>();

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
    return this.filterSet && this.filterSet.id === 'global' ? 'panorama_fish_eye' : 'adjust';
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

  onSave() {
    this.save.emit(this.filterSet);
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


