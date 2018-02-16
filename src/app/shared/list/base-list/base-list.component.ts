import {EventEmitter, Output} from '@angular/core';
import {Item} from '../list-database';
import {DataSource} from '@angular/cdk/collections';

export abstract class BaseListComponent {
  dataSource: DataSource<any>;
  displayedColumns = ['id', 'name', 'description'];

  @Output()
  protected rowClick = new EventEmitter<Item | Item[]>();
  protected multiSelect = false;
  protected selectedItems: Set<Item> = new Set();

  trackById(index: number, item: Item) {
    return item.id;
  }

  onRowClick(item: Item) {
    if (this.multiSelect) {
      if (this.selectedItems.has(item)) {
        this.selectedItems.delete(item);
      } else {
        this.selectedItems.add(item);
      }
      this.rowClick.emit(Array.from(this.selectedItems));
    } else if (!this.selectedItems.has(item)) {
      this.selectedItems.clear();
      this.selectedItems.add(item);
      this.rowClick.emit(item);
    }
  }

  isSelected(item: Item) {
    return this.selectedItems.has(item);
  }

}
