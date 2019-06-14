import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../containers';
import {EntityResolverService} from '../services/entity-resolver.service';
import {EntityDetailsComponent} from '../containers/entity-details/entity-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    resolve: {
      entities: EntityResolverService
    },
  },
  {
    path: 'virksomhet',
    component: EntityDetailsComponent,
    resolve: {
      entities: EntityResolverService
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}
