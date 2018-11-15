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

  name = '';
  tooltips = true;
  keyboard = true;

  exclusive = false;

  @Input()
  set config(config: any) {
    if (config) {
      this.name = config.name;
      const domain = config.domain;
      this.range = {
        min: domain[0],
        max: domain[1]
      };
      this.model = [domain[0], domain[1]];
    }
  }

  @Output()
  change: EventEmitter<number | number[] | number[][]> = new EventEmitter();

  constructor() { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event, exclusive) {
    console.log(event, exclusive);
    // this.change.emit(event);
  }
}
