import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {LanguageComposition} from '../../../shared/models';

@Component({
  selector: 'app-language-composition',
  templateUrl: './language-composition.component.html',
  styleUrls: ['./language-composition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageCompositionComponent {

  @Input()
  language: LanguageComposition;

  constructor() {
  }

  get nbPercentage() {
    return this.language ? this.language.nbPercentage : 0;
  }

  get nnPercentage() {
    return this.language ? this.language.nnPercentage : 0;
  }
}
