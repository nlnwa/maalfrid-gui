import { Component, OnInit } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-slider-filter',
  templateUrl: './slider-filter.component.html',
  styleUrls: ['./slider-filter.component.scss']
})
export class SliderFilterComponent implements ControlValueAccessor, OnInit {

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

  /**
   * @return {object} new instance of default slider configuration
   */
  private static defaultSliderConfig() {
    return {
      connect: true,
      start: [0, 100],
      range: {
        min: 0,
        max: 100,
      },
      tooltips: [true, true],
      step: 1,
    };
  }

  private static defaultFilterModel() {
    return [0, 0]
  }
