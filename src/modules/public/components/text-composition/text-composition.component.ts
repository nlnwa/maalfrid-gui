import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TextCount} from '../../../shared/models';

@Component({
  selector: 'app-text-composition',
  templateUrl: './text-composition.component.html',
  styleUrls: ['./text-composition.component.scss'],
})
export class TextCompositionComponent {

  @Input()
  textCount: TextCount;

  constructor() {
  }

  get nbLongCount() {
    return this.textCount ? this.textCount.nbLongCount : 0;
  }

  get nbShortCount() {
    return this.textCount ? this.textCount.nbShortCount : 0;
  }

  get nnLongCount() {
    return this.textCount ? this.textCount.nnLongCount : 0;
  }

  get nnShortCount() {
    return this.textCount ? this.textCount.nnShortCount : 0;
  }

}
