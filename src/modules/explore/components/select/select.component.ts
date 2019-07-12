import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter} from '../../../shared/';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  emptyOption: '';
  placeholder = '';
  options: string[] = [];
  disabled = false;
  model = [];
  name = '';
  exclusive = false;

  @Input()
  set config(config: any) {
    if (config) {
      this.name = config.name;
      this.exclusive = false;
      this.placeholder = config.label;
      this.options = [...(config.domain as string[])];
      this.model = [];
      this.emptyOption = config.emptyOption || '';
    }
  }

  // tslint:disable-next-line:no-output-native
  @Output()
  change: EventEmitter<Filter> = new EventEmitter();

  constructor() { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(value, exclusive) {
    this.change.emit({value, exclusive, name: this.name});
  }
}
