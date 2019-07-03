import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {
  AboutDialogComponent,
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
    EntityDetailsComponent,
    AboutDialogComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    NgxChartsModule,
  ],
  exports: [
    HomeComponent,
    EntityDetailsComponent
  ],
  entryComponents: [AboutDialogComponent]
})
export class PublicModule {
}
