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
import {HomeComponent, EntityDetailsComponent} from './containers';
import { ChartComponent } from './components/chart/chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    HomeComponent,
    EntitySelectorComponent,
    EntityListComponent,
    LanguageCompositionComponent,
    TextCompositionComponent,
    EntityListComponent,
    SeedListComponent,
    ChartComponent,
    EntityDetailsComponent
  ],
  imports: [
    PublicRoutingModule,
    SharedModule,
    NgxChartsModule,
  ],
})
export class PublicModule {
}
