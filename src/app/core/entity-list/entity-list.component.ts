import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BaseListComponent} from '../../shared/list/base-list/base-list.component';
import {ListDataSource} from '../../shared/list/list-datasource';
import {Database, Item, ListDatabase} from '../../shared/list/list-database';
import {VeidemannService} from '../veidemann-service/veidemann.service';
import {Entity} from '../../shared/models/config.model';

@Component({
  selector: 'app-entity-list',
  template: `
    <div>
      <mat-toolbar color="primary">
        <mat-icon class="icon-header">business</mat-icon>
        {{ selected || 'Entitet' }}
      </mat-toolbar>
      <mat-table [dataSource]="dataSource"
                 [trackBy]="trackById">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>Entitet</mat-header-cell>
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
  styleUrls: ['../../shared/list/base-list/base-list.component.css'],
  providers: [ListDatabase, {provide: Database, useClass: ListDatabase}],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityListComponent extends BaseListComponent implements OnInit {
  constructor(private database: Database,
              private veidemannService: VeidemannService) {
    super();
    this.displayedColumns = ['name', 'description'];
    this.dataSource = new ListDataSource(database);
  }

  get selected(): string {
    if (this.selectedItems.size > 0) {
      return (this.selectedItems.values().next().value as any).meta.name;
    }
  }

  ngOnInit(): void {
    const query = {
      selector: JSON.stringify({
        label: [{key: 'Group', value: 'Språkrådet'}]
      })
    };
    this.veidemannService.getEntities(query).subscribe((entities) => {
      this.database.items = entities;
    });
  }

}


