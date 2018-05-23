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


@Component({
  selector: 'app-uri-list',
  template: `
    <style>
      .narrow {
        max-width: 90px;
      }

      .uri {
      }

      .uri__size {
        font-size: 12px;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="primary">
        <mat-icon>link</mat-icon>&nbsp;URI
        <span fxFlex></span>
        <button mat-icon-button (click)="onToggleFilter()">
          <mat-icon>filter_list</mat-icon>
        </button>
      </mat-toolbar>

      <mat-form-field class="app-container__padding" [fxShow]="showFilter">
        <input #filter matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
      </mat-form-field>

      <mat-table class="table" [dataSource]="dataSource" matSort>

        <ng-container matColumnDef="requestedUri">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Uri</mat-header-cell>
          <mat-cell *matCellDef="let row"><a href="{{row.requestedUri}}" target="_blank">{{row.requestedUri}}</a>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="referrer">
          <mat-header-cell class="uri" *matHeaderCellDef mat-sort-header>Referert av</mat-header-cell>
          <mat-cell class="uri uri__size" *matCellDef="let row">{{row.referrer}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="contentType">
          <mat-header-cell *matHeaderCellDef mat-sort-header>MIME</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.contentType.split(';')[0]}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="recordType">
          <mat-header-cell fxFlex class="narrow" *matHeaderCellDef mat-sort-header>Type</mat-header-cell>
          <mat-cell fxFlex class="narrow" *matCellDef="let row">{{row.recordType}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="characterCount">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Tegn</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.characterCount}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="discoveryPath">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Tre</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.discoveryPath}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="lix">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Lesbarhet</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.lix}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="longWordCount">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Lange ord</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.longWordCount}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="wordCount">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Ord</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.wordCount}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="language">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Språk</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.language}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="sentenceCount">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Setninger</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.sentenceCount}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="size">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Størrelse</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">{{row.size}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="warcId">
          <mat-header-cell class="narrow" *matHeaderCellDef mat-sort-header>Text</mat-header-cell>
          <mat-cell class="narrow" *matCellDef="let row">
            <button mat-icon-button (click)="onTextClick(row.warcId); $event.stopPropagation();">
              <mat-icon>comment</mat-icon>
            </button>
          </mat-cell>
        </ng-container>


        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>

        <mat-row *matRowDef="let row; columns: displayedColumns"
                 [ngClass]="{'highlight': selection.isSelected(row)}"
                 (click)="onRowClick(row)">
        </mat-row>
      </mat-table>


      <mat-paginator [pageSize]="pageSize"
                     [pageSizeOptions]="pageSizeOptions"
                     [showFirstLastButtons]="true">
      </mat-paginator>
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UriListComponent implements OnInit, OnChanges, AfterViewInit {
  displayedColumns = [
    'requestedUri',
    'contentType',
    'recordType',
    'discoveryPath',
    'lix',
    'characterCount',
    'wordCount',
    'longWordCount',
    'sentenceCount',
    'language',
    'warcId',
  ];
  dataSource: MatTableDataSource<AggregateText | any>;
  selection = new SelectionModel<AggregateText | any>(false, []);
  showFilter = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filterInput: ElementRef;

  @Input()
  texts: (AggregateText | any )[];

  @Output()
  text: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  rowClick = new EventEmitter<Entity>();

  constructor(private maalfridService: MaalfridService) {
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

  get selected(): AggregateText | any {
    return this.selection.hasValue() ? this.selection.selected[0] : null;
  }


  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.texts) {
      if (this.texts) {
        this.dataSource.data = this.texts;
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.sort.start = 'desc';
    this.dataSource.sort = this.sort;
  }

  onTextClick(warcId: string) {
    this.text.emit(warcId);
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

}


