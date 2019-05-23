import {enableProdMode, LOCALE_ID} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { AppModule } from './modules/app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/** @see https://github.com/angular/angular-cli/issues/6683 */
const providers = [
  {provide: LOCALE_ID, useValue: 'nb-NO'}
];

platformBrowserDynamic(providers).bootstrapModule(AppModule, {providers})
  .catch(err => console.log(err));
