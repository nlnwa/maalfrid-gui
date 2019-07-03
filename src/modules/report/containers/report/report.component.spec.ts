import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {isDepartment, isEntity, isSeed, ReportComponent, Statistic} from './report.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MaalfridService} from '../../../core/services';
import {of} from 'rxjs';
import {SharedModule} from '../../../shared/shared.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from '../../../core/core.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CoreModule,
        SharedModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: MaalfridService, useValue: {
            getEntities: () => of([]),
            getSeeds: () => of([]),
            getStatisticByYear: () => of([]),
            getExecutions: () => of([]),
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isSeed', () => {
    it('should identify a row as a seed', () => {
      const seed = {
        endTime: 'time',
        jobExecutionId: 'jobID',
        executionId: 'executionID',
        seedId: 'seedID',
        entityId: 'entityID',
        department: 'department',
        statistic: {},
      };

      const department: Statistic = {
        ...seed,
        seedId: undefined,
        entityId: undefined,
      };

      const entity: Statistic = {
        ...seed,
        seedId: undefined,
      };

      expect(isSeed(seed)).toBeTruthy();
      expect(isSeed(department)).toBeFalsy();
      expect(isSeed(entity)).toBeFalsy();
    });
  });

  describe('isEntity', () => {
    const base = {
      endTime: 'time',
      jobExecutionId: 'jobID',
      executionId: 'executionID',
      seedId: 'seedID',
      entityId: 'entityID',
      department: 'department',
      statistic: {},
    };

    it('should identify a department total row as not an entity', () => {
      const depTotal = {
        ...base,
        seedId: undefined,
        entityId: undefined
      };
      expect(isEntity(depTotal, [])).toBeFalsy();
    });

    it('should identify an entity total row as an entity', () => {
      const entityTotal = {
        ...base,
        seedId: undefined
      };

      expect(isEntity(entityTotal, [])).toBeTruthy();
    });

    it('should identify a row as an entity if it is the only seedID with a specific seedID', () => {
      const allRows = [
        base,
        {
          ...base,
          entityId: base.entityId,
          seedId: 'seedMyHarvest',
        }
      ];

      expect(isEntity(base, allRows)).toBeFalsy();
      expect(isEntity(base, [base])).toBeTruthy();
    });
  });

  describe('isDepartment', () => {
    it('should identify a row as a department', () => {
      const base = {
        endTime: 'time',
        jobExecutionId: 'jobID',
        executionId: 'executionID',
        seedId: 'seedID',
        entityId: 'entityID',
        department: 'department',
        statistic: {},
      };
      const falsy1 = {
        ...base,
        seedId: undefined,
      };
      const falsy2 = {
        ...base,
        entityId: undefined,
      };
      const department = {
        ...base,
        entityId: undefined,
        seedId: undefined,
      };
      expect(isDepartment(base)).toBeFalsy();
      expect(isDepartment(falsy1)).toBeFalsy();
      expect(isDepartment(falsy2)).toBeFalsy();
      expect(isDepartment(department)).toBeTruthy();
    });
  });
});
