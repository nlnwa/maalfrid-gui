import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TextCount} from '../../../shared/models';

@Component({
  selector: 'app-text-composition',
  templateUrl: './text-composition.component.html',
  styleUrls: ['./text-composition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextCompositionComponent {

  nbPercentage: number;
  nnPercentage: number;
  nbLongCount: number;
  nbShortCount: number;
  nnLongCount: number;
  nnShortCount: number;

  @Input()
  set textCount(textCount: TextCount) {
    if (!textCount) {
      return;
    }
    this.nbPercentage = textCount.nbPercentage;
    this.nnPercentage = textCount.nnPercentage;
    this.nbLongCount = textCount.nbLongCount;
    this.nbShortCount = textCount.nbShortCount;
    this.nnLongCount = textCount.nnLongCount;
    this.nnShortCount = textCount.nnShortCount;
  }
}
