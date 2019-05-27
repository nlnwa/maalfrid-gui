import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Entity} from '../../../shared/models';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material';

@Component({
  selector: 'app-entity-selector',
  templateUrl: './entity-selector.component.html',
  styleUrls: ['./entity-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitySelectorComponent implements OnChanges {

  @Input()
  entities: Entity[];

  @Output()
  selectEntity: EventEmitter<Entity> = new EventEmitter();

  term = new FormControl();

  private options = new BehaviorSubject<Entity[]>([]);
  option$: Observable<Entity[]>;

  constructor() {
    this.option$ = this.term.valueChanges
      .pipe(
        startWith<string | Entity>(''),
        map(value => typeof value === 'string' ? value : value.meta.name),
        map((term) =>
          this.options.value.filter(option =>
            option.meta.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()))),
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entities) {
      this.options.next(this.entities);
    }
  }

  onSelectEntity(event: MatAutocompleteSelectedEvent) {
    this.selectEntity.emit(event.option.value);
  }

  displayFn(entity?: Entity): string | undefined {
    return entity ? entity.meta.name : undefined;
  }
}
