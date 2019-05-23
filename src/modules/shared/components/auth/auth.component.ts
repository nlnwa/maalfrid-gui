import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, SnackBarService} from '../../../core/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService) { }

  get name(): string {
    return this.authService.name;
  }

  get groups(): string {
    return this.authService.groups;
  }

  onLogin() {
    this.authService.login(this.route.snapshot.url.join('/'));
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/'], {relativeTo: this.route.root})
      .then(() => this.snackBarService.openSnackBar('Logget ut'));
  }
}
