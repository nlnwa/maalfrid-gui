import {EventEmitter, Output} from '@angular/core';
import {Item} from '../list-database';
import {DataSource} from '@angular/cdk/collections';

export abstract class BaseListComponent {
  @Output()
  protected rowClick = new EventEmitter<Item | Item[]>();
  protected dataSource: DataSource<any>;
  protected displayedColumns = ['id', 'name', 'description'];
  protected multiSelect = false;
  protected selectedItems: Set<Item> = new Set();

  protected onRowClick(item: Item) {
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

  protected isSelected(item: Item) {
    return this.selectedItems.has(item);
  }

  protected trackById(index: number, item: Item) {
    return item.id;
  }
}
