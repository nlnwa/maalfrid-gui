import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Entity} from '../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AboutDialogComponent} from '../../components';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  entities: Entity[];

  showInfo = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {
    this.entities = this.route.snapshot.data.entities;
  }

  onSelectEntity(entity: Entity) {
    this.router.navigate(['virksomhet'], {queryParams: {id: entity.id}, relativeTo: this.route})
      .catch((error) => console.error(error));
  }

  onOpenAboutDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(AboutDialogComponent, dialogConfig);
  }
}
