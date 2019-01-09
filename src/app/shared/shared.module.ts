import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {AuthComponent} from './components/auth/auth.component';
import {AppRoutingModule} from '../app-routing.module';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {SnackBarService} from './services/snack-bar/snack-bar.service';
import {AuthGuard, AuthService, RoleService, TokenInterceptor} from './services/auth';


@NgModule({
  declarations: [
    AuthComponent,
    ToolbarComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    MaterialModule,
  ],
  exports: [
    AuthComponent,
    ToolbarComponent,
    CommonModule,
    MaterialModule,
  ],
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService,
        AuthGuard,
        RoleService,
        TokenInterceptor,
        SnackBarService,
      ],
    };
  }
}
