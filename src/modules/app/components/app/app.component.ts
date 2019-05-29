import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth';
import {Router} from '@angular/router';
import {AppInitializerService} from '../../../core/services';
import {AppConfigService} from '../../../core/services/app.config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private appInitializerService: AppInitializerService,
              private appConfigService: AppConfigService,
              private router: Router) {
  }

  get name(): string {
    return this.authService.name;
  }

  get version(): string {
    return this.appConfigService.version;
  }

  get initialized(): boolean {
    return this.appInitializerService.initialized;
  }

  get error(): string {
    return this.appInitializerService.error.message;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn && this.authService.requestedPath) {
      this.router.navigate([this.authService.requestedPath])
        .catch(() => {
        });
    }
  }
}
