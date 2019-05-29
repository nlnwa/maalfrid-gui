import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {Entity} from '../../../shared/models';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  private entities = new ReplaySubject<Entity[]>(1);
  entity$ = this.entities.asObservable();

  constructor(private route: ActivatedRoute) {
    this.route.data
      .pipe(take(1))
      .subscribe((data: { entities: Entity[] }) => this.entities.next(data.entities));
  }

  onSelectEntity(entity: Entity) {
  }
}
