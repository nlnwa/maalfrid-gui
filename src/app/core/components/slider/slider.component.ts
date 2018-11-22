import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Filter} from '../../models/maalfrid.model';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  label = '';
  name = '';
  tooltips = true;
  keyboard = true;

  exclusive = false;

  @Input()
  set config(config: any) {
    if (config) {
      this.name = config.name;
      this.label = config.label;
      this.exclusive = false;
      const domain = config.domain;
      let min = domain[0];
      let max = domain[1];
      if (min === max) {
        min--;
        max++;
      }
      this.range = {min, max};
      this.model = [min, max];
    }
  }

  @Output()
  change: EventEmitter<Filter> = new EventEmitter();

  constructor() { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(value: number[], exclusive: boolean) {
    this.change.emit({value, exclusive, name: this.name});
  }
}
