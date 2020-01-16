import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth';
import {Router} from '@angular/router';
import {AppInitializerService} from '../../../core/services';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(private appInitializer: AppInitializerService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.isLoggedIn && this.authService.requestedPath) {
      // navigate to any requested path after login
      this.router.navigate([this.authService.requestPath]);
    }
  }

  get name(): string {
    return this.authService.name;
  }

  get version(): string {
    return environment.version;
  }

  get initialized(): boolean {
    return this.appInitializer.initialized;
  }

  get error(): string {
    return this.appInitializer.error.message;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}
