import {Component, Input} from '@angular/core';
import {TextCount} from '../../../shared/models';

@Component({
  selector: 'app-text-composition',
  templateUrl: './text-composition.component.html',
  styleUrls: ['./text-composition.component.scss']
})
export class TextCompositionComponent {

  @Input()
  textCount: TextCount;

  constructor() {
  }

  get nbLongCount() {
    return this.textCount.nbLongCount;
  }

  get nbShortCount() {
    return this.textCount.nbShortCount;
  }

  get nnLongCount() {
    return this.textCount.nnLongCount;
  }

  get nnShortCount() {
    return this.textCount.nnShortCount;
  }

}
