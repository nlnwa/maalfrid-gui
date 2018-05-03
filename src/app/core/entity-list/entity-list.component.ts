import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Entity} from '../../shared/models/config.model';
import {SelectionModel} from '@angular/cdk/collections';
import {_isNumberValue} from '@angular/cdk/coercion';

@Component({
  selector: 'app-entity-list',
  template: `
    <style>
      .entity-container {
        height: 100%;
      }

      .entity-list-table {
        height: 100%;
        overflow-y: scroll;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section class="entity-container" fxLayout="column">
      <mat-toolbar class="app-toolbar" color="primary">
        <mat-icon class="icon-header">business</mat-icon>
        {{ name || 'Entitet' }}
      </mat-toolbar>

      <mat-form-field class="container">
        <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
      </mat-form-field>

      <mat-table class="entity-list-table" [dataSource]="dataSource" matSort>

        <ng-container matColumnDef="meta.name">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Entitet</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.meta.name }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="description">
          <mat-header-cell *matHeaderCellDef>Description</mat-header-cell>
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
export class EntityListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['meta.name', 'description'];
  dataSource: MatTableDataSource<Entity>;
  selection = new SelectionModel<Entity>(false, []);

  @ViewChild(MatSort) sort: MatSort;

  @Output()
  private rowClick = new EventEmitter<Entity>();

  constructor(private maalfridService: MaalfridService) {
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

  ngOnInit(): void {
    this.maalfridService.getEntities()
      .map((entities) => entities.sort((a, b) => a.meta.name < b.meta.name ? -1 : (a.meta.name === b.meta.name ? 0 : 1)))
      .subscribe((entities) => this.dataSource.data = entities);
  }

  ngAfterViewInit() {
    this.sort.start = 'desc';
    this.dataSource.sort = this.sort;
  }
}


