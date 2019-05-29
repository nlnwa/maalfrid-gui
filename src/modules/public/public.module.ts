import {NgModule} from '@angular/core';
import {PublicRoutingModule} from './routing/public-routing.module';
import {SharedModule} from '../shared/shared.module';
import {EntitySelectorComponent, LanguageCompositionComponent} from './components';
import {HomeComponent} from './containers';
import { TextCompositionComponent } from './components/text-composition/text-composition.component';
import { SeedListComponent } from './components/seed-list/seed-list.component';

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
