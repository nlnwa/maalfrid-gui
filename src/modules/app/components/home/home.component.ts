import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppInitializerService, AuthService} from '../../../core/services';
import {AppConfigService} from '../../../core/services/app.config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  constructor(private appInitializerService: AppInitializerService,
              private appConfigService: AppConfigService,
              private authService: AuthService) {
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
}
