import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent implements ControlValueAccessor, OnInit {

  @Output()
  change: EventEmitter<any>;

  // selected
  model: any = [];

  // Empty option placeholder for select dropdowns
  readonly emptyOption = {
    discoveryPath: 'Rot'
  };

  onChange: (_) => void;
  onTouched: (_) => void;
  disabled = false;

  constructor() { }

  ngOnInit() {
  }

  // ControlValueAccessor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // ControlValueAccessor
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // ControlValueAccessor
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ControlValueAccessor
  writeValue(obj: any): void {

  }

  onSelectionChange(event) {
    this.change.emit();
  }
}
