import {Component, OnInit} from '@angular/core';
import {BaseListComponent} from '../base-list/base-list.component';
import {ListDataSource} from '../commons/list-datasource';
import {Database, ListDatabase} from '../commons/list-database';
import {VeidemannService} from '../veidemann-service/veidemann.service';

@Component({
  selector: 'app-crawljob-list',
  template: `
    <div>
      <mat-toolbar>
        <mat-icon class="icon-header">work</mat-icon>
        Jobb
      </mat-toolbar>
      <mat-table [dataSource]="dataSource"
                 [trackBy]="trackById">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>CrawlJob</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.meta.name}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="description">
          <mat-header-cell *matHeaderCellDef>Description</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.meta.description}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="id">
          <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.id}}</mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>

        <mat-row *matRowDef="let row; columns: displayedColumns"
                 [ngClass]="{highlight: isSelected(row)}"
                 (click)="onRowClick(row)">
        </mat-row>
      </mat-table>
    </div>`,
  styleUrls: ['../base-list/base-list.component.css'],
  providers: [ListDatabase, {provide: Database, useClass: ListDatabase}]
})
export class CrawljobListComponent extends BaseListComponent implements OnInit {
  constructor(private database: Database,
              private veidemannService: VeidemannService) {
    super();
    this.displayedColumns = ['name'];
    this.dataSource = new ListDataSource(database);
  }

  ngOnInit(): void {
    this.veidemannService.getCrawlJobs().subscribe((entities) => {
      this.database.items = entities;
    });
  }
}


