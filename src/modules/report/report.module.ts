import {NgModule} from '@angular/core';
import {ReportComponent} from './containers/';
import {SharedModule} from '../shared/shared.module';
import {ReportRoutingModule} from './routing/';


@NgModule({
  declarations: [ReportComponent],
  imports: [
    SharedModule,
    ReportRoutingModule,
  ],
})
export class ReportModule {
}
