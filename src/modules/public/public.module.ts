import {NgModule} from '@angular/core';
import {PublicRoutingModule} from './routing/public-routing.module';
import {SharedModule} from '../shared/shared.module';
import {
  EntityListComponent,
  EntitySelectorComponent,
  LanguageCompositionComponent,
  SeedListComponent,
  TextCompositionComponent
} from './components';
import {HomeComponent} from './containers';

@NgModule({
  declarations: [
    HomeComponent,
    EntitySelectorComponent,
    EntityListComponent,
    LanguageCompositionComponent,
    TextCompositionComponent,
    EntityListComponent,
    SeedListComponent
  ],
  imports: [
    PublicRoutingModule,
    SharedModule,
  ]
})
export class PublicModule {
}
