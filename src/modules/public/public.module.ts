import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {
  ChartComponent,
  EntityListComponent,
  EntitySelectorComponent,
  LanguageCompositionComponent,
  SeedListComponent,
  TextCompositionComponent
} from './components';
import {EntityDetailsComponent, HomeComponent} from './containers';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent,
    EntitySelectorComponent,
    EntityListComponent,
    LanguageCompositionComponent,
    TextCompositionComponent,
    SeedListComponent,
    ChartComponent,
    EntityDetailsComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    NgxChartsModule,
  ],
  exports: [
    HomeComponent,
    EntityDetailsComponent
  ]
})
export class PublicModule {
}
