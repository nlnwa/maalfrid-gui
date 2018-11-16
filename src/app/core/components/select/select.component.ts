import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter} from '../../models/maalfrid.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Output()
  change: EventEmitter<Filter> = new EventEmitter();

  @Input()
  emptyOption: '';

  placeholder = '';

  @Input()
  options: string[] = [];

  disabled = false;

  model = [];
  name = '';

  @Input()
  set config(config: any) {
    if (config) {
      this.name = config.name;
      this.placeholder = config.label;
      this.options = [...(config.domain as string[])];
      this.model = [];
    }
  }

  constructor() { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(value, exclusive) {
    this.change.emit({value, exclusive, name: this.name});
  }
}
