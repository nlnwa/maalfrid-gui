import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import {SelectionModel} from '@angular/cdk/collections';
import {Filter, FilterSet} from '../../../shared/';
import {_isNumberValue} from '@angular/cdk/coercion';


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
      <mat-toolbar fxFlex class="app-toolbar" color="accent">
        <mat-icon>{{ icon }}</mat-icon>&nbsp;{{ name }}
        <span fxFlex></span>
        <button mat-icon-button (click)="onToggleBypass()">
          <mat-icon>{{ visibilityIcon }}</mat-icon>
        </button>
        <button mat-icon-button (click)="onReset()">
          <mat-icon>refresh</mat-icon>
        </button>
        <button mat-icon-button (click)="onToggleVisibility()">
          <mat-icon>{{ showHideIcon }}</mat-icon>
        </button>
      </mat-toolbar>

      <div fxFlex [fxHide]="!visible" [fxShow]="visible">
        <table mat-table matSort [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Navn</th>
            <td mat-cell *matCellDef="let row">{{ formatName(row.name) }}</td>
          </ng-container>

          <ng-container matColumnDef="field">
            <th mat-header-cell *matHeaderCellDef>Felt</th>
            <td mat-cell *matCellDef="let row">{{ formatName(row.field) }}</td>
          </ng-container>


          <ng-container matColumnDef="exclusive">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Eksl.</th>
            <td mat-cell *matCellDef="let row">{{ row.exclusive ? 'Ja' : '' }}</td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Verdi</th>
            <td mat-cell *matCellDef="let row">{{ formatValue(row.value) }}</td>
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
        <mat-paginator
          [pageSize]="pageSize"
          [pageSizeOptions]="pageSizeOptions"
          [showFirstLastButtons]="true">
        </mat-paginator>
      </div>
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSetComponent implements OnChanges, AfterViewInit {
  readonly nobNames = {
    language: 'Språk',
    contentType: 'Mediatype',
    discoveryPath: 'Tre',
    requestedUri: 'Domene',
    lix: 'Lesbarhet',
    sentenceCount: 'Setninger',
    wordCount: 'Ord',
    shortWordCount: 'Korte ord',
    longWordCount: 'Lange ord',
    characterCount: 'Tegn',
    matchRegexp: 'Reg. uttr.'
  };

  displayedColumns = ['name', 'field', 'exclusive', 'value', 'remove'];
  dataSource: MatTableDataSource<Filter>;
  selection = new SelectionModel<Filter>(true, []);
  visible = true;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50, 100];

  @Input()
  filterSet: FilterSet;

  @Output()
  rowClick = new EventEmitter<Filter[]>();

  @Output()
  save = new EventEmitter<FilterSet>();

  @Output()
  reset = new EventEmitter<void>();


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  isSaved = true;
  private bypass = false;

  constructor() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string | number => {
      const value: any = data[sortHeaderId];
      return _isNumberValue(value) ? Number(value) : value;
    };
  }

  get name(): string {
    if (this.filterSet) {
      if (this.filterSet.id === 'global') {
        return 'Globalt filtersett';
      } else {
        return 'Filtersett';
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

  get visibilityIcon(): string {
    return this.bypass ? 'visibility_off' : 'visibility';
  }

  get filters(): Filter[] {
    return this.filterSet ? this.filterSet.filters : [];
  }

  get showHideIcon(): string {
    return this.visible ? 'expand_less' : 'expand_more';
  }

  formatValue(value: any): string {
    if (value instanceof Array) {
      return value.join(', ');
    } else {
      return value;
    }
  }

  formatName(name: string): string {
    return this.nobNames[name] || name;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterSet) {
      this.dataSource.data = [];
      this.selection.clear();
      this.update();
    }
  }

  addFilters(filters: Filter[]) {
    this.filterSet.filters.push(...filters);
    this.update();
    this.save.emit(this.filterSet);
  }

  onToggleBypass(): void {
    this.bypass = !this.bypass;
    this.rowClick.emit(this.bypass ? [] : this.selection.selected);
  }

  onToggleVisibility() {
    this.visible = !this.visible;
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
      this.save.emit(this.filterSet);
      this.update();
    } else {
      console.warn('onRemoveFilter: filter not found: ' + filter);
    }
  }

  onRowClick(filter) {
    this.selection.toggle(filter);
    if (this.selection.hasValue()) {
      this.rowClick.emit(this.bypass ? [] : this.selection.selected);
    } else {
      this.rowClick.emit([]);
    }
  }

  onReset() {
    this.reset.emit();
  }

  private update() {
    if (this.filterSet) {
      this.selection.clear();
      this.dataSource.data = this.filterSet.filters;
      if (this.filters.length > 0) {
        this.selection.select(...this.filters);
        this.rowClick.emit(this.bypass ? [] : this.selection.selected);
      } else {
        this.rowClick.emit([]);
      }
      this.visible = true;
    } else {
      this.rowClick.emit([]);
      this.visible = false;
    }
  }
}


