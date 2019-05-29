import {NgModule} from '@angular/core';
import {PublicRoutingModule} from './routing/public-routing.module';
import {SharedModule} from '../shared/shared.module';
import {EntitySelectorComponent} from './components';
import {HomeComponent} from './containers';

@NgModule({
  declarations: [
    HomeComponent,
    EntitySelectorComponent,
  ],
  imports: [
    PublicRoutingModule,
    SharedModule,
  ]
})
export class PublicModule {
}
