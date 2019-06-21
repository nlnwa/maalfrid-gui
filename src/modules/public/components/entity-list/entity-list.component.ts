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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {_isNumberValue} from '@angular/cdk/coercion';

import {Entity} from '../../../shared/';


@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityListComponent implements OnChanges, AfterViewInit {
  displayedColumns = ['name'];
  dataSource: MatTableDataSource<Entity>;
  selection = new SelectionModel<Entity>(false, []);
  showFilter = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  entities: Entity[];

  @Input()
  id: string;

  @Output()
  rowClick = new EventEmitter<Entity>();

  constructor() {
    this.dataSource = new MatTableDataSource([]);

    this.dataSource.sortingDataAccessor = (data: Entity): string | number => {
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

  onApplyFilter(filter: string) {
    this.dataSource.filter = filter;
  }

  onRowClick(entity) {
    if (this.selection.hasValue()) {
      this.selection.clear();
    }
    this.selection.select(entity);
    this.rowClick.emit(entity);
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

    if (changes.id && this.id) {
      const found = this.entities.find(entity => entity.id === this.id);
      if (found) {
        this.selection.select(found);
      }
    }
  }
}


