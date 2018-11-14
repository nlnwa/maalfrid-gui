import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Seed} from '../../models/config.model';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';


@Component({
  selector: 'app-seed-list',
  template: `
    <style>
      table {
        height: 100%;
        width: 100%;
      }

      .toolbar-link {
        font-weight: lighter;
      }

      .highlight {
        background-color: #eee;
      }
    </style>
    <section fxLayout="column" fxShow [fxHide]="isListEmpty">
      <mat-toolbar class="app-toolbar" color="accent">
        <mat-icon>link</mat-icon>&nbsp;URL
        <span fxFlex></span>
        <span class="toolbar-link">{{ url }}</span>
        <span fxFlex></span>
        <button mat-icon-button (click)="onToggleVisibility()">
          <mat-icon>{{ visible ? "expand_less" : "expand_more" }}</mat-icon>
        </button>
      </mat-toolbar>

      <table mat-table [fxHide]="!visible" [dataSource]="dataSource">
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
    </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedListComponent implements OnChanges {
  displayedColumns = ['name'];
  dataSource = new MatTableDataSource<Seed>([]);
  selection = new SelectionModel<Seed>();
  visible = true;

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

  get isListEmpty(): boolean {
    return !(this.seeds && this.seeds.length > 0);
  }

  get url(): string {
    return this.selected ? this.selected.meta.name : '';
  }

  get selected(): Seed {
    return this.selection.hasValue() ? this.selection.selected[0] : null;
  }

  onToggleVisibility() {
    this.visible = !this.visible;
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
