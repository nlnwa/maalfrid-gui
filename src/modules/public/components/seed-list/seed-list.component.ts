import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SeedStatistic} from '../../../shared/models';
import {MatSort} from '@angular/material';
import {_isNumberValue} from '@angular/cdk/coercion';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-seed-list',
  templateUrl: './seed-list.component.html',
  styleUrls: ['./seed-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeedListComponent implements AfterViewInit {

  @Input()
  set seeds(seeds: SeedStatistic[]) {
    this.dataSource.data = seeds ? seeds.sort((a, b) => isNaN(a.nbPercentage)
      ? isNaN(b.nbPercentage) ? 0 : 1
      : isNaN(b.nbPercentage)
        ? -1
        : a.nbPercentage < b.nbPercentage
          ? 1
          : a.nbPercentage > b.nbPercentage
            ? -1
            : 0)
      : [];
  }

  @Input()
  set primary(id: string) {
    if (id !== '') {
      this.selection.select(id);
    }
  }

  @Output()
  rowClick = new EventEmitter<string>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns = ['uri', 'nb', 'nn', 'primary'];

  dataSource: MatTableDataSource<SeedStatistic>;

  selection = new SelectionModel<string>(false, []);

  constructor() {
    this.dataSource = new MatTableDataSource<SeedStatistic>([]);

    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string | number => {

      const value = data[sortHeaderId];
      const direction = this.sort.direction;

      if (sortHeaderId.startsWith('nb')) {
        if (isNaN(data.nbPercentage)) {
          if (direction === 'asc') {
            return Number.MIN_SAFE_INTEGER;
          }
          if (direction === 'desc') {
            return Number.MAX_SAFE_INTEGER;
          }

        } else {
          return data.nbPercentage;
        }
      }

      if (sortHeaderId.startsWith('nn')) {
        if (isNaN(data.nnPercentage)) {
          if (direction === 'asc') {
            return Number.MIN_SAFE_INTEGER;
          }
          if (direction === 'desc') {
            return Number.MAX_SAFE_INTEGER;
          }
        } else {
          return data.nnPercentage;
        }
      }
      return _isNumberValue(value) ? Number(value) : value;
    };

    this.dataSource.sortData = (data: any, sort: MatSort): any[] => {
      const active = sort.active;
      const direction = sort.direction;

      if (!active || direction === '') {
        return data;
      }

      return data.sort((a, b) => {
        const valueA = this.dataSource.sortingDataAccessor(a, active);
        const valueB = this.dataSource.sortingDataAccessor(b, active);


        let comparatorResult = 0;

        if (valueA != null && valueB != null) {
          // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
          if (valueA > valueB) {
            comparatorResult = 1;
          } else if (valueA < valueB) {
            comparatorResult = -1;
          }
        } else if (valueA != null) {
          comparatorResult = 1;
        } else if (valueB != null) {
          comparatorResult = -1;
        }
        return comparatorResult * (direction === 'asc' ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER);

      });
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onRowClick(seedId: string) {
    if (this.selection.hasValue()) {
      this.selection.clear();
    }
    this.selection.select(seedId);
    this.rowClick.emit(seedId);
  }
}



