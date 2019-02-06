import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {AuthComponent} from '../../shared/components';
import {AuthService, RoleService} from '../../core/services/auth';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, AuthComponent ],
      providers: [
        {provide: AuthService, useValue: {}},
        {provide: RoleService, useValue: {}}
      ],
      imports: [RouterTestingModule, MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
