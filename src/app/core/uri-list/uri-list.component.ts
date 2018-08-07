import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Entity} from '../../shared/models/config.model';
import {SelectionModel} from '@angular/cdk/collections';
import {_isNumberValue} from '@angular/cdk/coercion';
import {AggregateText} from '../../shared/models/maalfrid.model';
import {RoleService} from '../../auth';


@Component({
  selector: 'app-uri-list',
  templateUrl: './uri-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UriListComponent implements OnInit, OnChanges, AfterViewInit {
  defaultColumns = [
    'requestedUri',
    'contentType',
    'lix',
    'wordCount',
    'longWordCount',
    'sentenceCount',
    'language',
    'warcId',
  ];
  adminColumns = [
    'requestedUri',
    'contentType',
    'discoveryPath',
    'lix',
    'characterCount',
    'wordCount',
    'longWordCount',
    'sentenceCount',
    'language',
    'warcId',
  ];
  displayedColumns = this.defaultColumns;
  dataSource: MatTableDataSource<AggregateText | any>;
  selection = new SelectionModel<AggregateText | any>(false, []);
  showFilter = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  visible = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filterInput: ElementRef;

  @Input()
  data: (AggregateText | any)[];

  @Output()
  text: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  rowClick = new EventEmitter<Entity>();

  @Output()
  cellClick = new EventEmitter<any>();

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

  }

  isExtendedRow = (index, item) => true;

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.texts) {
      if (this.data) {
        this.dataSource.data = this.data;
        this.visible = this.data.length > 0 ? true : false;
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.sort.start = 'desc';
    this.dataSource.sort = this.sort;
  }

  onToggleVisibility() {
    this.visible = !this.visible;
  }

  onTextClick(uri: AggregateText) {
    this.text.emit(uri.warcId);
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

  applyFilter(filter: string) {
    this.dataSource.filter = filter;
  }

  onRowClick(entity) {
    this.rowClick.emit(entity);
  }
}


