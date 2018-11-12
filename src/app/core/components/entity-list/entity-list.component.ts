import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Entity} from '../../models/config.model';
import {SelectionModel} from '@angular/cdk/collections';
import {_isNumberValue} from '@angular/cdk/coercion';


@Component({
  selector: 'app-entity-list',
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
        <mat-icon>business</mat-icon>&nbsp;Entitet
        <span fxFlex></span>
        <button mat-icon-button (click)="onToggleFilter()">
          <mat-icon>filter_list</mat-icon>
        </button>
      </mat-toolbar>

      <mat-form-field class="app-container__padding" [fxShow]="showFilter">
        <input #filter matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
      </mat-form-field>

      <mat-table class="table" [dataSource]="dataSource" matSort>

        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Entitet</mat-header-cell>
          <mat-cell *matCellDef="let row">
            <span [matTooltip]="row.meta.description"
                  [matTooltipDisabled]="row.meta.description === row.meta.name"
                  [matTooltipShowDelay]="350">{{ row.meta.name}}</span>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="description">
          <mat-header-cell *matHeaderCellDef>Beskrivelse</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.meta.description}}</mat-cell>
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
export class EntityListComponent implements OnChanges, AfterViewInit {
  displayedColumns = ['name'];
  dataSource: MatTableDataSource<Entity>;
  selection = new SelectionModel<Entity>(false, []);
  showFilter = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filterInput: ElementRef;

  @Input()
  entities: Entity[];

  @Output()
  rowClick = new EventEmitter<Entity>();

  constructor() {
    this.dataSource = new MatTableDataSource([]);

    this.dataSource.sortingDataAccessor = (data: Entity, sortHeaderId: string): string | number => {
      const value: any = data.meta.name;
      return _isNumberValue(value) ? Number(value) : value;
    };

    this.dataSource.filterPredicate = (data: Entity, filter: string): boolean => {
      // Transform the data into a lowercase string of all property values.
      const accumulator = (currentTerm, key) => currentTerm + data.meta[key];

      // filter on name and description
      const dataStr = ['name', 'description'].reduce(accumulator, '').toLowerCase();

      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  get name(): string {
    return this.selected ? this.selected.meta.name : '';
  }

  get selected(): Entity {
    return this.selection.hasValue() ? this.selection.selected[0] : null;
  }

  onToggleFilter() {
    this.showFilter = !this.showFilter;

    if (this.showFilter) {
      setTimeout(() => this.filterInput.nativeElement.focus(), 0);
    } else {
      this.filterInput.nativeElement.value = '';
      this.applyFilter('');
    }
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter;
  }

  onRowClick(entity) {
    this.selection.toggle(entity);
    if (this.selection.hasValue()) {
      this.rowClick.emit(entity);
    } else {
      this.rowClick.emit(null);
    }
  }

  ngAfterViewInit() {
    this.sort.start = 'desc';
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entities && this.entities) {
      this.entities.sort((a, b) => a.meta.name < b.meta.name ? -1 : (a.meta.name === b.meta.name ? 0 : 1));
      this.dataSource.data = this.entities;
    }
  }
}


