import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Output()
  change: EventEmitter<string[]> = new EventEmitter();

  @Input()
  emptyOption: '';

  @Input()
  placeholder = '';

  @Input()
  options: string[] = [];

  disabled = false;

  @Input()
  set config(config: any) {
    if (config) {
      this.placeholder = config.name;
      this.options = [...(config.domain as string[])];
    }
  }

  constructor() { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event) {
    this.change.emit(event.value);
  }
}
