import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BaseListComponent} from '../../shared/list/base-list/base-list.component';
import {ListDataSource} from '../../shared/list/list-datasource';
import {Database, ListDatabase} from '../../shared/list/list-database';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';

@Component({
  selector: 'app-entity-list',
  template: `
    <section class="entity-container" fxLayout="column">
      <mat-toolbar class="app-toolbar" color="primary">
        <mat-icon class="icon-header">business</mat-icon>
        {{ selected || 'Entitet' }}
      </mat-toolbar>
      <mat-table class="entity-list-table" [dataSource]="dataSource"
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
    </section>`,
  styleUrls: ['entity-list.component.css', '../../shared/list/base-list/base-list.component.css'],
  providers: [ListDatabase, {provide: Database, useClass: ListDatabase}],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityListComponent extends BaseListComponent implements OnInit {
  constructor(private database: ListDatabase,
              private maalfridService: MaalfridService) {
    super();
    this.displayedColumns = ['name', 'description'];
    this.dataSource = new ListDataSource(database);
  }

  get selected(): string {
    if (this.selectedItems.size > 0) {
      return (this.selectedItems.values().next().value as any).meta.description;
    }
  }

  ngOnInit(): void {
      this.maalfridService.getEntities().subscribe((entities) => this.database.items = entities);
  }

}


