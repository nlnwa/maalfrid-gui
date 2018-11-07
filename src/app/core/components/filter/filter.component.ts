import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Filter, FilterSet} from '../../../shared/models/maalfrid.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnChanges {

  private filterSet: FilterSet;

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


  // bypasses filter if true
  bypass = false;


  disabled = false;

  @Input()
  domain: any;

  @Input()
  filter: any;

  @Output()
  change: EventEmitter<object> = new EventEmitter();

  @Output()
  save: EventEmitter<object> = new EventEmitter();

  constructor() {}

  get bypassIcon() {
    return this.bypass ? 'visibility_off' : 'visibility';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domain) {
      if (this.domain) {
        this.reset();
      } else {
        this.domain = undefined;
      }
    } else if (changes.filter) {
      Object.assign(this.filterModel, this.filter);
    }
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
    this.filterModel = [];
    this._bypass = false;
    this.setDisabledState(false);
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

  ngOnChanges(changes: SimpleChanges): void {
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
