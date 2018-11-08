import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent {

  @Output()
  change: EventEmitter<any>;

  // selected
  model: any[] = [];

  // Empty option placeholder for select dropdowns
  readonly emptyOption = {
    discoveryPath: 'Rot'
  };

  disabled = false;

  constructor() { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event) {
    this.change.emit();
  }
}
