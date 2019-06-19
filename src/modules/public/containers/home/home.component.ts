import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {Entity} from '../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  entities: Entity[];

  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.entities = this.route.snapshot.data.entities;
  }

  onSelectEntity(entity: Entity) {
    this.router.navigate(['virksomhet'], {queryParams: {id: entity.id}, relativeTo: this.route})
      .catch((error) => console.error(error));
  }
}
