import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Subject} from 'rxjs/internal/Subject';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {

  // Norwegian translation of filter labels
  readonly label = {
    language: 'Språk',
    contentType: 'Mediatype',
    discoveryPath: 'Tre',
    requestedUri: 'Domene',
    lix: 'Lesbarhet',
    sentenceCount: 'Setninger',
    wordCount: 'Ord',
    shortWordCount: 'Korte ord',
    longWordCount: 'Lange ord',
    characterCount: 'Tegn',
  };

  // Empty option placeholder for select dropdowns
  readonly emptyOption = {
    discoveryPath: 'Rot'
  };

  // value domain of data
  private _domain: object;
  filterModel = [];

  // bypasses filter if true
  _bypass = false;

  private sliders = ['lix', 'characterCount', 'sentenceCount', 'wordCount', 'longWordCount'];
  private selections = ['language', 'contentType', 'discoveryPath', 'requestedUri'];

  selections$ = new Subject<string[]>();
  sliders$ = new Subject<string[]>();

  sliderConfigs = {};
  disabled = false;

  @Output()
  change: EventEmitter<object> = new EventEmitter();

  @Output()
  save: EventEmitter<object> = new EventEmitter();

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
    return {
      language: [],
      contentType: [],
      discoveryPath: [],
      requestedUri: [],
      lix: [0, 0],
      characterCount: [0, 0],
      sentenceCount: [0, 0],
      longWordCount: [0, 0],
      wordCount: [0, 0],
    };
  }

  constructor() {}

  @Input()
  set domain(domain: any) {
    if (domain) {
      this._domain = domain;
      this.reset();
    } else {
      this._domain = undefined;
      this.selections$.next(null);
      this.sliders$.next(null);
    }
  }

  @Input()
  set filter(obj: any) {
    Object.assign(this.filterModel, obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSave() {
    this.save.emit(this.transformFilter(this.filterModel));
  }

  /**
   * Toggle filter bypass. Triggered by button click.
   */
  onToggleBypass() {
    this._bypass = !this._bypass;
    this.setDisabledState(this._bypass);
    this._bypass ? this.change.emit(null) : this.onFilterChange();
  }

  /**
   * Helper for getting options for a specific selection dropdown.
   *
   * @param selection {string} name of selection dropdown
   * @return {Array} array of options
   */
  getSelectOptions(selection) {
    return Array.from(this._domain[selection]).sort();
  }

  onFilterChange() {
    this.change.emit(this.transformFilter(this.filterModel));
  }

  /**
   * Update filter (sliders and selections) with new domain values.
   *
   * Called when domain is changed.
   */
  private reset() {
    this.filterModel = {};
    this._bypass = false;
    this.setDisabledState(false);
    this.resetSelections();
    this.resetSliders();
  }

  private resetSelections() {
    // Object.assign(this.filterModel, FilterComponent.defaultSelectionConfig());
    this.selections.forEach((selection) => {
      this.filterModel[selection] = [];
    });
    this.selections$.next(this.selections);
  }

  private resetSliders() {
    this.sliders.forEach((slider) => {
      this.filterModel[slider] = [this._domain[slider][0], this._domain[slider][1]];
      this.initSliderConfig(slider);
    });
    this.recreateSliders();
  }

  /**
   * Initialize configuration for named slider
   *
   * @param slider {string} name of slider to initialize
   */
  private initSliderConfig(slider) {
    const config = FilterComponent.defaultSliderConfig();
    const domain = this._domain[slider];
    config.range.min = domain ? domain[0] : 0;
    config.range.max = domain ? domain[1] : 100;
    config.start = domain;
    this.sliderConfigs[slider] = config;
  }

  /**
   * a hack to recreate sliders every update because the ng2-nouislider component
   * doesn't handle the way we are updating slider config
   */
  private recreateSliders() {
    this.sliders$.next(null); // remove sliders
    setTimeout(() => this.sliders$.next(this.sliders)); // recreate sliders
  }

  /**
   * Transform filters by removing those with values matching domain values
   *
   * @param filter {object}
   */
  private transformFilter(filter: object) {
    return Object.entries(filter).reduce((acc: any, [name, value]) => {
      if (filter[name].length === this._domain[name].length
        && this._domain[name].every((v, index) => v === value[index])) {
        return acc;
      } else if (filter[name].length === 0) {
        return acc;
      } else {
        acc[name] = filter[name];
        return acc;
      }
    }, {});
  }

  /*
    set uri(uris: string[]) {
      if (uris.length === 0) {
        this.uriValue = '';
        return;
      }
      const re = /^https?:\/\/(.*\.)?(.+\..+$)\/?/;
      this.uriValue = uris.map((uri) => uri.replace(re, 'https?:\/\/.*\.?$2')).join('|');
    }
    */
}
