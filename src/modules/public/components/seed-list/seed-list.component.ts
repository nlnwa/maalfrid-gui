import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {SeedStatistic} from '../../../shared/models';

@Component({
  selector: 'app-seed-list',
  templateUrl: './seed-list.component.html',
  styleUrls: ['./seed-list.component.scss']
})
export class SeedListComponent implements OnChanges {

  @Input()
  seeds: SeedStatistic[] = [];

  displayedColumns = ['uri', 'nb', 'nn'];
  dataSource = new MatTableDataSource<SeedStatistic>([]);

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.seeds && this.seeds) {
      this.dataSource.data = this.seeds;
    }
  }

}
