import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AggregateText} from '../../models/maalfrid.model';
import {SelectionModel} from '@angular/cdk/collections';
import {_isNumberValue} from '@angular/cdk/coercion';

@Component({
  selector: 'app-uri',
  templateUrl: './uri.component.html',
  styleUrls: ['./uri.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UriComponent implements OnInit, AfterViewInit {
  defaultColumns = [
    'endTime',
    'contentType',
    'lix',
    'discoveryPath',
    'characterCount',
    'wordCount',
    'longWordCount',
    'sentenceCount',
    'language',
    'warcId'
  ];
  displayedColumns = this.defaultColumns;
  dataSource: MatTableDataSource<AggregateText>;
  selection = new SelectionModel<AggregateText>(false, []);
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50, 100];
  visible = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  set data(data: AggregateText[]) {
    this.dataSource.data = data;
    this.visible = !!data.length;
  }

  @Output()
  text: EventEmitter<AggregateText> = new EventEmitter<AggregateText>();

  @Output()
  rowClick = new EventEmitter<AggregateText>();

  @Output()
  cellClick = new EventEmitter<any>();

  constructor() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string | number => {
      const value: any = data[sortHeaderId];
      return _isNumberValue(value) ? Number(value) : value;
    };
  }

  get showHideIcon(): string {
    return this.visible ? 'expand_less' : 'expand_more';
  }

  formatContentType(contentType: string) {
    return contentType.split(';')[0];
  }

  ngOnInit() {
    // this.onToggleVisibility();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.sort.start = 'desc';
    this.dataSource.sort = this.sort;
  }

  onToggleVisibility() {
    this.visible = !this.visible;
  }

  onTextClick(text: AggregateText) {
    this.text.emit(text);
  }

  onCellClick(event, row, column) {
    event.stopPropagation();
    this.cellClick.emit({[column]: row[column]});
  }

  onRowClick(text: AggregateText) {
  }
}
