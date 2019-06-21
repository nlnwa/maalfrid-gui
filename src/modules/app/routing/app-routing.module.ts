import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../core/services';
import {Role} from '../../shared/models';
import {EntityDetailsComponent, HomeComponent} from '../../public/containers';
import {EntityResolverService} from '../../core/services/entity-resolver.service';

const routes: Routes = [
  {
    path: 'rapport',
    loadChildren: () => import('../../report/report.module').then(m => m.ReportModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [Role.READONLY, Role.ADMIN, Role.CURATOR],
    }
  },
  {
    path: 'utforsk',
    loadChildren: () => import('../../explore/explore.module').then(m => m.ExploreModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    data: {
      allowedRoles: [Role.READONLY, Role.ADMIN, Role.CURATOR],
    }
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    resolve: {
      entities: EntityResolverService
    }
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
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
