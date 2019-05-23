import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../components';
import {AuthGuard} from '../../core/services';
import {Role} from '../../shared/models';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'rapport',
    loadChildren: '../../report/report.module#ReportModule',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [Role.READONLY, Role.ADMIN, Role.CURATOR],
    },
  },
  {
    path: 'utforsk',
    loadChildren: '../../explore/explore.module#ExploreModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    data: {
      allowedRoles: [Role.READONLY, Role.ADMIN, Role.CURATOR],
    },
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
