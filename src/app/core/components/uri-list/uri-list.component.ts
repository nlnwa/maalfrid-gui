import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MaalfridService} from '../../services/maalfrid-service/maalfrid.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {_isNumberValue} from '@angular/cdk/coercion';
import {AggregateText} from '../../models/maalfrid.model';
import {RoleService} from '../../../auth';
import {groupBy} from '../../func/util';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-uri-list',
  templateUrl: './uri-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UriListComponent implements AfterViewInit {
  private sortDirection = new BehaviorSubject<string>('asc');

  defaultColumns = [
    'count',
    'requestedUri',
    'contentType',
    'lix',
    'wordCount',
    'longWordCount',
    'sentenceCount',
    'language',
  ];
  adminColumns = [
    ...this.defaultColumns,
    'discoveryPath',
    'characterCount',
  ];
  displayedColumns = this.defaultColumns;
  dataSource: MatTableDataSource<AggregateText>;
  selection = new SelectionModel<AggregateText | any>(false, []);
  showFilter = false;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50, 100];
  visible = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filterInput: ElementRef;

  @Input()
  set data(data: AggregateText[]) {
    this._data.next(data);
    this.rowClick.emit([]);
  }

  @Output()
  cellClick = new EventEmitter<any>();

  @Output()
  rowClick = new EventEmitter<AggregateText[]>();


  _data = new BehaviorSubject<AggregateText[]>([]);
  data$ = this._data.asObservable();

  group: any;

  mergedData$ = combineLatest(this.data$, this.sortDirection).pipe(
    map(([data, sortDirection]) => {
      if (!data) {
        this.group = {};
        return [];
      }
      this.group = groupBy(data, 'requestedUri');

      return Object.keys(this.group).map(requestedUri => {
        const count = this.group[requestedUri].length;
        return this.group[requestedUri].reduce((acc, curr) => {
          Object.keys(curr).forEach((key) => {
            switch (key) {
              case 'requestedUri':
                break;
              default:
                if (!acc.hasOwnProperty(key)) {
                  acc[key] = curr[key];
                } else {
                  acc[key] = sortDirection === 'asc'
                    ? acc[key] > curr[key] ? acc[key] : curr[key]
                    : acc[key] < curr[key] ? acc[key] : curr[key];
                }
                break;
            }
          });
          return acc;
        }, {count, requestedUri});
      });
    })
  );

  constructor(private maalfridService: MaalfridService,
              private roleService: RoleService) {
    if (this.roleService.isAdmin()) {
      this.displayedColumns = this.adminColumns;
    }
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string | number => {
      const value: any = data[sortHeaderId];
      return _isNumberValue(value) ? Number(value) : value;
    };

    this.dataSource.filterPredicate = (data: AggregateText, filter: string): boolean => {
      // Transform the data into a lowercase string of all property values.
      const accumulator = (currentTerm, key) => currentTerm + data[key];

      // filter on name and description
      const dataStr = ['requestedUri'].reduce(accumulator, '').toLowerCase();

      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) !== -1;
    };
    this.mergedData$.subscribe((_) => this.dataSource.data = _);
  }

  get showHideIcon(): string {
    return this.visible ? 'expand_less' : 'expand_more';
  }

  formatContentType(contentType: string) {
    return contentType.split(';')[0];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.sort.start = 'desc';
    this.dataSource.sort = this.sort;
  }

  onToggleVisibility() {
    this.visible = !this.visible;
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

  onCellClick(event, row, column) {
    event.stopPropagation();
    this.cellClick.emit({[column]: row[column]});
  }

  onRowClick(text: AggregateText) {
    this.selection.toggle(text);
    if (this.selection.hasValue()) {
      this.rowClick.emit(this.group[text.requestedUri]);
    } else {
      this.rowClick.emit([]);
    }
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter;
  }

  onToggleSortDirection() {
    this.sortDirection.next(this.sortDirection.value === 'asc' ? 'desc' : 'asc');
  }

}


