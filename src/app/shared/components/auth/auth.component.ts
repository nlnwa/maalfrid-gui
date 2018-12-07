import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {

  constructor(private authService: AuthService, private router: Router) { }

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
