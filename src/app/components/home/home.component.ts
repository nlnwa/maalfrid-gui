import {ChangeDetectionStrategy, Component} from '@angular/core';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  constructor(private authService: AuthService) {
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get version(): string {
    return environment.version;
  }
}
