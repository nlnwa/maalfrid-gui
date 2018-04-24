import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BaseListComponent} from '../../shared/list/base-list/base-list.component';
import {Entity} from '../../shared/models/config.model';
import {Database, ListDatabase} from '../../shared/list/list-database';
import {ListDataSource} from '../../shared/list/list-datasource';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';


@Component({
  selector: 'app-seed-list',
  template: `
    <div>
      <mat-toolbar color="primary">
        <mat-icon class="icon-header">link</mat-icon>
        {{ selected || 'URL' }}
      </mat-toolbar>
      <mat-table [dataSource]="dataSource"
                 [trackBy]="trackById">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>URL</mat-header-cell>
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

        <ng-container matColumnDef="scope">
          <mat-header-cell *matHeaderCellDef>Sort friendly URI Reordering Transform</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.scope.surt_prefix}}</mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>

        <mat-row *matRowDef="let row; columns: displayedColumns"
                 [ngClass]="{highlight: isSelected(row)}"
                 (click)="onRowClick(row)">
        </mat-row>
      </mat-table>
    </div>`,
  styleUrls: ['../../shared/list/base-list/base-list.component.css'],
  providers: [{provide: Database, useClass: ListDatabase}],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedListComponent extends BaseListComponent {

  private _entity: Entity;

  constructor(private database: Database,
              private maalfridService: MaalfridService) {
    super();
    this.displayedColumns = ['name'];
    this.dataSource = new ListDataSource(database);
  }

  get entity(): Entity {
    return this._entity;
  }

  get selected(): string {
    if (this.selectedItems.size > 0) {
      return (this.selectedItems.values().next().value as any).meta.name;
    } else {
      return undefined;
    }
  }

  @Input()
  set entity(entity: Entity) {
    this._entity = entity;
    this.maalfridService.getSeeds(entity).subscribe((seeds) => {
      this.database.items = seeds;
      if (seeds.length > 0) {
        this.onRowClick(seeds[0]);
      }
    });
  }
}
