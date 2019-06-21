import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SeedStatistic} from '../../../shared/models';

@Component({
  selector: 'app-seed-list',
  templateUrl: './seed-list.component.html',
  styleUrls: ['./seed-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeedListComponent {

  @Input()
  set seeds(seeds: SeedStatistic[]) {
    this.dataSource.data = seeds || [];
  };

  displayedColumns = ['uri', 'nb', 'nn'];
  dataSource = new MatTableDataSource<SeedStatistic>([]);
}
