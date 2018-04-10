import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {BaseListComponent} from '../../shared/list/base-list/base-list.component';
import {ListDataSource} from '../../shared/list/list-datasource';
import {Database, Item, ListDatabase} from '../../shared/list/list-database';
import * as moment from 'moment';

@Component({
  selector: 'app-execution-list',
  template: `
    <section>
      <mat-toolbar color="primary">
        <mat-icon class="icon-header">event</mat-icon>
        Innhøstinger
        <span fxFlex></span>
        <button mat-raised-button (click)="onSelectAll()" color="accent">Velg alle</button>
      </mat-toolbar>
      <mat-table [dataSource]="dataSource"
                 [trackBy]="trackById">

        <ng-container matColumnDef="id">
          <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.id}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="startTime">
          <mat-header-cell *matHeaderCellDef>Start</mat-header-cell>
          <mat-cell *matCellDef="let row">{{formatDate(row.startTime)}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="endTime">
          <mat-header-cell *matHeaderCellDef>Slutt</mat-header-cell>
          <mat-cell *matCellDef="let row">{{formatDate(row.endTime)}}</mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>

        <mat-row *matRowDef="let row; columns: displayedColumns"
                 [ngClass]="{highlight: isSelected(row)}"
                 (click)="onRowClick(row)">
        </mat-row>
      </mat-table>
    </section>`,
  styleUrls: ['../../shared/list/base-list/base-list.component.css'],
  providers: [ListDatabase, {provide: Database, useClass: ListDatabase}],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutionListComponent extends BaseListComponent {
  protected multiSelect = true;

  constructor(private database: Database,
              private changeDetector: ChangeDetectorRef) {
    super();
    this.displayedColumns = ['startTime', 'endTime'];
    this.dataSource = new ListDataSource(database);
  }

  @Input()
  set executions(executions: any) {
    if (executions) {
      this.database.items = executions;
      this.onSelectAll();
    }
  }

  get executions(): any {
    return this.database.items.length;
  }

  onSelectAll() {
    this.selectedItems = new Set(this.database.items as Item[]);
    this.rowClick.emit(Array.from(this.selectedItems));
    // this.changeDetector.markForCheck();
  }

  formatDate(date: Date): string {
    const m = moment(date);
    return m.format('LL LTS');
  }
}


