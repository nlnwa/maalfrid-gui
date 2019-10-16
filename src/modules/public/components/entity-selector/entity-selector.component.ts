import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Entity} from '../../../shared/models';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface DepartmentGroup {
  name: string;
  entities: Entity[];
}

const DEPARTMENT_NONE = 'Ikke tilknyttet departement';

@Component({
  selector: 'app-entity-selector',
  templateUrl: './entity-selector.component.html',
  styleUrls: ['./entity-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitySelectorComponent implements OnChanges {

  @Input()
  entities: Entity[];

  @Input()
  panelWidth: number;

  @Output()
  selectEntity: EventEmitter<Entity> = new EventEmitter();

  form: FormGroup;

  @ViewChild(MatAutocompleteTrigger, { static: true })
  private trigger: MatAutocompleteTrigger;

  private departments = new BehaviorSubject<DepartmentGroup[]>([]);
  department$: Observable<DepartmentGroup[]>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      entity: ''
    });

    this.department$ = this.entity.valueChanges
      .pipe(
        startWith<string | Entity>(''),
        map(value => typeof value === 'string' ? value : value.meta.name),
        map((term) =>
          term === ''
            ? this.departments.value
            : this.departments.value.reduce((acc, curr) => {
              const entities = curr.entities.filter(entity =>
                entity.meta.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
              return entities.length > 0 ? [...acc, {...curr, entities}] : acc;
            }, []))
      );
  }

  get entity(): AbstractControl {
    return this.form.get('entity');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entities && this.entities) {
      // group entities by department
      const entityByDepartment = this.entities.reduce((acc, entity) => {
        const department = entity.meta.department || DEPARTMENT_NONE;
        (acc[department] = acc[department] || []).push(entity);
        return acc;
      }, {});

      const departmentGroups = Object.entries(entityByDepartment)
        .map(([name, entities]: [string, Entity[]]) => ({
          name,
          entities: entities.sort((a, b) => a.meta.name > b.meta.name ? 1 : a.meta.name < b.meta.name ? -1 : 0)
        })).sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);

      this.departments.next(departmentGroups);
    }
  }

  onSelectEntity(event: MatAutocompleteSelectedEvent) {
    this.selectEntity.emit(event.option.value);
  }

  onClear() {
    this.form.setValue({entity: ''});
    setTimeout(() => this.trigger.openPanel());
  }

  displayFn(entity?: Entity): string | undefined {
    return entity ? entity.meta.name : undefined;
  }
}
