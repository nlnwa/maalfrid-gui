import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../../shared/material.module';
import {AuthService} from '../../../core/services/auth';
import {AppInitializerService} from '../../../core/services';
import {AppConfigService} from '../../../core/services/app.config.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            name: undefined
          },
        },
        {
          provide: AppInitializerService,
          useValue: {
            initialized: true
          }
        },
        {
          provide: AppConfigService,
          useValue: {
            version: 'Test'
          }
        }
      ],
      imports: [RouterTestingModule, MaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
});
