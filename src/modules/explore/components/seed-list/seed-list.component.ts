import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

import {Seed} from '../../../shared/';


@Component({
  selector: 'app-seed-list',
  template: `
    <style>
      section {
        height: 100%;
      }

      table {
        width: 100%;
      }

      .table-scroll {
        height: 100%;
        overflow-y: auto;
      }

      .toolbar-link {
        font-weight: lighter;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon>link</mat-icon>&nbsp;Nettsted
        <span fxFlex></span>
      </mat-toolbar>

      <div fxFlex="grow" class="table-scroll">
        <table mat-table [dataSource]="dataSource">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>URL</th>
            <td mat-cell *matCellDef="let row">
              <a style="color: inherit;" target="_blank" href="{{row.meta.name}}">{{row.meta.name}}</a>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>

          <tr mat-row *matRowDef="let row; columns: displayedColumns"
              [ngClass]="{highlight: selection.isSelected(row)}"
              (click)="onRowClick(row)">
          </tr>
        </table>
      </div>
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
