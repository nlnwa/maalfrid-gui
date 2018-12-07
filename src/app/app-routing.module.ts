import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StatisticsComponent} from './core/containers/statistics/statistics.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './shared/services/auth';
import {Role} from './core/models/config.model';
import {ReportComponent} from './core/containers/report/report.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [AuthGuard],
        data: {
          allowedRoles: [Role.READONLY, Role.ADMIN, Role.CURATOR],
        },
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
