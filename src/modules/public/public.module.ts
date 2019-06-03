import {NgModule} from '@angular/core';
import {PublicRoutingModule} from './routing/public-routing.module';
import {SharedModule} from '../shared/shared.module';
import {EntitySelectorComponent, LanguageCompositionComponent, SeedListComponent, TextCompositionComponent} from './components';
import {HomeComponent} from './containers';

@NgModule({
  declarations: [
    HomeComponent,
    EntitySelectorComponent,
    LanguageCompositionComponent,
    TextCompositionComponent,
    SeedListComponent
  ],
  imports: [
    PublicRoutingModule,
    SharedModule,
  ]
})
export class PublicModule {
}
