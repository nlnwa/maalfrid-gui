import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './modules/app/app.module';
import {environment} from './environments/environment';
import 'hammerjs';
import {AppConfigService} from './modules/core/services/app.config.service';
import {AppConfig} from './modules/core/models/app.config.model';

if (environment.production) {
  enableProdMode();
}

// load dynamic configuration pre bootstrap
fetch(environment.configUrl)
  .then(async response => {
    const dynamicConfig = await response.json();
    return Object.assign({}, environment, dynamicConfig) as AppConfig;
  })
  .then((appConfig: AppConfigService) =>
    platformBrowserDynamic([{provide: AppConfigService, useValue: appConfig}])
      .bootstrapModule(AppModule)
      .catch(err => console.error(err))
  );
