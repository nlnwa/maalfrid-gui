import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Entity, Seed} from '../../shared/models/config.model';
import {MaalfridService} from '../maalfrid-service/maalfrid.service';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';


@Component({
  selector: 'app-seed-list',
  template: `
    <style>
      section {
        height: 100%;
      }

      .table {
        height: 100%;
        overflow-y: scroll;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="primary">
        <mat-icon>link</mat-icon>&nbsp;URL
      </mat-toolbar>

      <mat-table [dataSource]="dataSource" class="table">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>URL</mat-header-cell>
          <mat-cell *matCellDef="let row">
            <a style="color: inherit;" target="_blank" href="{{row.meta.name}}">{{row.meta.name}}</a>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>

        <mat-row *matRowDef="let row; columns: displayedColumns"
                 [ngClass]="{highlight: selection.isSelected(row)}"
                 (click)="onRowClick(row)">
        </mat-row>
      </mat-table>
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedListComponent {


  displayedColumns = ['name'];
  dataSource = new MatTableDataSource<Seed>([]);
  selection = new SelectionModel<Seed>(true, []);

  @Output()
  private rowClick = new EventEmitter<Seed[]>();
  private _entity: Entity;

  constructor(private maalfridService: MaalfridService) {
  }

  @Input()
  set entity(entity: Entity) {
    this._entity = entity;
    this.selection.clear();

    if (entity === null) {
      this.dataSource.data = [];
      this.onRowClick();
      return;
    }

    this.maalfridService.getSeeds(entity)
      .subscribe((seeds) => {
        this.dataSource.data = seeds;
        if (seeds.length > 0) {
          this.onRowClick(seeds[0]);
        }
      });
  }

  get url(): string {
    return this.selected ? this.selected.meta.name : '';
  }

  get selected(): Seed {
    return this.selection.hasValue() ? this.selection.selected[0] : null;
  }

  onRowClick(seed?) {
    if (seed) {
      this.selection.toggle(seed);
    }
    this.rowClick.emit(this.selection.selected);
  }
}
