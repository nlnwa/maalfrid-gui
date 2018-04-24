import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';

export interface Item {
  id: string;
}

export abstract class Database {
  dataChange: BehaviorSubject<Item[]>;
  items: Item[];
}

@Injectable()
export class ListDatabase extends Database {
  dataChange: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  dataSet = new Set();

  get items(): Item[] {
    return this.dataChange.value;
  }

  set items(items: Item[]) {
    this.dataSet = new Set(items.map((item) => item.id));
    this.dataChange.next(items);
  }

  get isEmpty() {
    return this.dataSet.size < 1;
  }

  reset() {
    this.dataSet.clear();
    this.items = [];
  }

  add(item: Item) {
    if (this.dataSet.has(item.id)) {
      return;
    } else {
      this.dataSet.add(item.id);
    }
    const copy = this.items.slice();
    copy.push(item);
    this.items = copy;
  }


}

