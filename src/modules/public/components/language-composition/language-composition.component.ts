import {Component, Input} from '@angular/core';
import {LanguageComposition} from '../../../shared/models';

@Component({
  selector: 'app-language-composition',
  templateUrl: './language-composition.component.html',
  styleUrls: ['./language-composition.component.scss']
})
export class LanguageCompositionComponent {

  @Input()
  language: LanguageComposition;

  constructor() {
  }

  get nbPercentage() {
    return this.language.nbPercentage;
  }

  get nnPercentage() {
    return this.language.nnPercentage;
  }
}
