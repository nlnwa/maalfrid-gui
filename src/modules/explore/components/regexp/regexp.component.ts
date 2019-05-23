import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter} from '../../../shared/';

@Component({
  selector: 'app-regexp',
  templateUrl: './regexp.component.html',
  styleUrls: ['./regexp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegexpComponent {

  // Norwegian translation of filter labels
  readonly nobOption = {
    language: 'Språk',
    contentType: 'Mediatype',
    discoveryPath: 'Tre',
    requestedUri: 'URI'
  };

  @Output()
  change: EventEmitter<Filter> = new EventEmitter();

  placeholder = '';

  selectPlaceholder = 'Felt';
  selectOptions = [];
  selectEmptyOption = '';

  filter: Filter = {
    exclusive: false,
    name: '',
    field: '',
    value: ''
  };

  @Input()
  set config(config: any) {
    if (config) {
      this.filter.name = config.name;
      this.filter.exclusive = false;
      this.filter.value = '';
      this.placeholder = config.label;
      this.filter.field = '';
      this.selectOptions = [...(config.domain as string[])];
    }
  }

  constructor() { }

  formatOption(value: string) {
    return this.nobOption[value] || value || this.selectEmptyOption;
  }

  onFilterChange() {
    if (this.filter.field) {
      this.change.emit(this.filter);
    }
  }
}
