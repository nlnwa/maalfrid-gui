import {Component} from '@angular/core';
import {AuthService} from './auth';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private authService: AuthService, private router: Router) {
  }

  get version(): string {
    return environment.version;
  }

  get name(): string {
    return this.authService.name;
  }

  get groups(): string[] {
    return this.authService.groups;
  }

  onLogin() {
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
