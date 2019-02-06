import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StatisticsComponent} from './statistics.component';
import {ExploreModule} from '../../explore.module';
import {AuthService, RoleService} from '../../../core/services/auth';
import {MaalfridService, SnackBarService} from '../../../core/services';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ExploreModule, RouterTestingModule, SharedModule.forRoot(), NoopAnimationsModule],
      providers: [
        {
          provide: MaalfridService, useValue: {
            getEntities: () => of([]),
            getSeeds: () => of([]),
            getFilterSetById: () => of([]),
            getFilterSetsBySeedId: () => of([]),
          }
        },
        {provide: SnackBarService, useValue: {}},
        {provide: AuthService, useValue: {}},
        {
          provide: RoleService, useValue: {
            isAdmin: () => true
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
