import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get version(): string {
    return environment.version;
  }
}
