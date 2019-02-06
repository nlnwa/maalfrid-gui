import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthComponent} from './auth.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../material.module';
import {AuthService, RoleService} from '../../../core/services/auth';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      providers: [
        {
          provide: AuthService, useValue: {}
        },
        {provide: RoleService, useValue: {}}
      ],
      imports: [MaterialModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
