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
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon>{{ icon }}</mat-icon>&nbsp;{{ name }}
        <span fxFlex></span>
        <button mat-icon-button [disabled]="isSaved" (click)="onSave()">
          <mat-icon>save</mat-icon>
        </button>
        <button mat-icon-button (click)="onReset()">
          <mat-icon>refresh</mat-icon>
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
          <td mat-cell *matCellDef="let row">{{ row.exclusive ? 'Ja' : '' }}</td>
        </ng-container>

        <ng-container matColumnDef="value">
          <th mat-header-cell *matHeaderCellDef>Verdi</th>
          <td mat-cell *matCellDef="let row">{{ row.value }}</td>
        </ng-container>

        <ng-container matColumnDef="remove">
          <th mat-header-cell *matHeaderCellDef>Fjern</th>
          <td mat-cell *matCellDef="let row" (click)="$event.stopPropagation()">
            <button mat-icon-button (click)="onRemoveFilter(row)">
              <mat-icon>clear</mat-icon>
            </button>
          </td>
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
  displayedColumns = ['name', 'field', 'exclusive', 'value', 'remove'];
  dataSource: MatTableDataSource<Filter>;
  selection = new SelectionModel<Filter>(true, []);

  @Input()
  filterSet: FilterSet;

  @Output()
  rowClick = new EventEmitter<Filter[]>();

  @Output()
  save = new EventEmitter<FilterSet>();

  @Output()
  reset = new EventEmitter<void>();

  private isSaved = true;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterSet) {
      this.dataSource.data = [];
      this.selection.clear();
      this.isSaved = true;
      this.update();
    }
  }

  addFilters(filters: Filter[]) {
    this.isSaved = false;
    this.filterSet.filters.push(...filters);
    this.update();
  }

  onRemoveFilter(filter: Filter) {
    const index = this.filterSet.filters.findIndex((_: Filter) =>
      filter.name === _.name &&
      filter.value === _.value &&
      filter.exclusive === _.exclusive &&
      filter.field === _.field
    );
    if (index > -1) {
      this.filterSet.filters.splice(index, 1);
      this.isSaved = false;
      this.update();
    } else {
      console.warn('onRemoveFilter: filter not found: ' + filter);
    }
  }

  onRowClick(filter) {
    this.selection.toggle(filter);
    if (this.selection.hasValue()) {
      this.rowClick.emit(this.selection.selected);
    } else {
      this.rowClick.emit([]);
    }
  }

  onReset() {
    this.reset.emit();
  }

  onSave() {
    this.isSaved = true;
    this.save.emit(this.filterSet);
  }

  private update() {
    if (this.filterSet) {
      this.selection.clear();
      this.dataSource.data = this.filterSet.filters;
      if (this.filters.length > 0) {
        this.selection.select(...this.filters);
        this.rowClick.emit(this.selection.selected);
      } else {
        this.rowClick.emit([]);
      }
    } else {
      this.rowClick.emit([]);
    }
  }
}


