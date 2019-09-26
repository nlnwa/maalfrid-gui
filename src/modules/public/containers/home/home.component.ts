import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Entity} from '../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AboutDialogComponent} from '../../components';
import {PlatformLocation} from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  entities: Entity[];
  nnPageActive = false;
  nbPageActive = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private platformLocation: PlatformLocation) {
    this.entities = this.route.snapshot.data.entities;
    this.activePageLanguage();
  }

  onSelectEntity(entity: Entity) {
    this.router.navigate(['virksomhet'], {queryParams: {id: entity.id}, relativeTo: this.route})
      .catch((error) => console.error(error));
  }

  onOpenAboutDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(AboutDialogComponent, dialogConfig);
  }

  activePageLanguage() {
    if (this.platformLocation.href.indexOf('/nb/') > -1) {
      this.nnPageActive = false;
      this.nbPageActive = true;
    } else {
      this.nnPageActive = true;
      this.nbPageActive = false;
    }
  }
}
