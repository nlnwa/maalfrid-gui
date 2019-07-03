import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EntityDetailsComponent} from './entity-details.component';
import {PublicModule} from '../../public.module';
import {RouterTestingModule} from '@angular/router/testing';
import {MaalfridService} from '../../../core/services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('EntityDetailsComponent', () => {
  let component: EntityDetailsComponent;
  let fixture: ComponentFixture<EntityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PublicModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        {
          provide: MaalfridService,
          useValue: {}
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
