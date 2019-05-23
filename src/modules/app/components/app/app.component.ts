import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn && this.authService.requestedPath) {
      this.router.navigate([this.authService.requestedPath])
        .catch(err => {});
    }
  }
}
