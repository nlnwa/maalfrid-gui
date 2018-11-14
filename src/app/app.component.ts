import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <style>
      .container {
        height: 100%;
      }

      main {
        overflow: hidden;
      }

      .user {
        font-weight: lighter;
      }

      .title-link {
        text-decoration: none;
        color: inherit;
      }
    </style>

    <div class="container" fxLayout="column">
      <mat-toolbar class="app-toolbar">
        <img src="assets/favicon-32x32.png">&nbsp;<a routerLink='/' class="title-link">Målfrid</a>
        <span fxFlex></span>
        <span class="user">{{ name }}&nbsp;</span>
        <!-- Logon/Logoff-->
        <a color="primary" mat-raised-button (click)="onLogout()" *ngIf="name">
          <mat-icon>person</mat-icon>
          <ng-container i18n="@@toolbarLogon">Logg av</ng-container>
        </a>
        <a color="primary" mat-raised-button (click)="onLogin()" *ngIf="!name">
          <mat-icon>person</mat-icon>
          <ng-container i18n="@@toolbarLogon">Logg på</ng-container>
        </a>
      </mat-toolbar>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  get name(): string {
    return this.authService.name;
  }

  get groups(): string[] {
    return this.authService.groups;
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/statistics']);
    }
  }

  onLogin() {
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
