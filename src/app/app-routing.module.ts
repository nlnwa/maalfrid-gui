import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {StatisticsComponent} from './core/statistics/statistics.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './auth';
import {Role} from './shared/models/config.model';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        canActivate: [AuthGuard],
        data: {
          allowedRoles: [Role.READONLY, Role.ADMIN, Role.CURATOR],
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
