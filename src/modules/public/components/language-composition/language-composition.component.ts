import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {LanguageComposition} from '../../../shared/models';

@Component({
  selector: 'app-language-composition',
  templateUrl: './language-composition.component.html',
  styleUrls: ['./language-composition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageCompositionComponent {

  nbPercentage: number;
  nnPercentage: number;

  @Input()
  set language(language: LanguageComposition) {
    if (!language) {
      return;
    }
    this.nbPercentage = language.nbPercentage;
    this.nnPercentage = language.nnPercentage;
  }
}
