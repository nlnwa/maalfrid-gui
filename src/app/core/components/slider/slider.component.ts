import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  model: number | number[] | number [][] = [0, 1];

  disabled = false;

  step = 1;
  pageSteps = 10;

  connect = true;

  range: { [key: string]: number | number[] } = {
    min: 0,
    max: 1
  };

  tooltips = true;
  keyboard = true;

  @Input()
  set config(config: noUiSlider.Options | any) {
    if (config) {
      if (config.start) {
        this.model = config.start;
      }
      if (config.range) {
        this.range = {...config.range};
      }
      if (config.step) {
        this.step = config.step;
      }
    }
  }

  @Output()
  change: EventEmitter<number | number[] | number[][]> = new EventEmitter();

  constructor() { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event) {
    // this.change.emit(this.transformFilter(this.filterModel));
  }
}
