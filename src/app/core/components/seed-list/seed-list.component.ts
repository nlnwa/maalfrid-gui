import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Seed} from '../../../shared/models/config.model';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';


@Component({
  selector: 'app-seed-list',
  template: `
    <style>
      .table {
        height: 100%;
        overflow-y: auto;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="accent">
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
export class SeedListComponent implements OnChanges {
  displayedColumns = ['name'];
  dataSource = new MatTableDataSource<Seed>([]);
  selection = new SelectionModel<Seed>();


  @Input()
  seeds: Seed[] = [];

  @Output()
  private rowClick = new EventEmitter<Seed>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.seeds && this.seeds) {
      this.selection.clear();
      this.dataSource.data = this.seeds;
      if (this.seeds.length > 0) {
        this.onRowClick(this.seeds[0]);
      } else {
        this.onRowClick(null);
      }
    }
  }

  get url(): string {
    return this.selected ? this.selected.meta.name : '';
  }

  get selected(): Seed {
    return this.selection.hasValue() ? this.selection.selected[0] : null;
  }

  onRowClick(seed: Seed) {
    if (seed) {
      this.selection.toggle(seed);
    }
    if (this.selection.hasValue()) {
      this.rowClick.emit(seed);
    } else {
      this.rowClick.emit(null);
    }
  }

}
