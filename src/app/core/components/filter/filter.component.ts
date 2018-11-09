import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AggregateText, FilterSet} from '../../models/maalfrid.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnChanges {

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

  characterCount = new Subject<any>();
  language = new Subject<any>();

  config = {
    characterCount$: this.characterCount.asObservable(),
    language$: this.language.asObservable()
  };

  // bypasses filter if true
  bypass = false;


  disabled = false;

  @Input()
  domain: AggregateText | any;

  @Input()
  filterSet: FilterSet;

  @Output()
  change: EventEmitter<FilterSet> = new EventEmitter();

  @Output()
  save: EventEmitter<FilterSet> = new EventEmitter();

  constructor() {}

  get show(): string {
    return this.filterSet ? this.filterSet.filters.toString() : '';
  }

  get bypassIcon(): string {
    return this.bypass ? 'visibility_off' : 'visibility';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domain) {
      if (this.domain) {
        const range = {
          min: this.domain.characterCount[0],
          max: this.domain.characterCount[1]
        };
        this.characterCount.next({
          range,
          start: [range.min, range.max]
        });
      } else {
        this.domain = undefined;
      }
    } else if (changes.filterSet) {
      this.language.next(this.filterSet.filters[0].value);
      console.log(this.filterSet);
      // Object.assign(this.filterModel, this.filter);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSave() {
    // this.save.emit(this.transformFilter(this.filterModel));
  }

  /**
   * Toggle filter bypass. Triggered by button click.
   */
  onToggleBypass() {
    this.bypass = !this.bypass;
    this.setDisabledState(this.bypass);
    this.bypass ? this.change.emit(null) : this.onFilterChange();
  }

  onFilterChange() {
    // this.change.emit(this.transformFilter(this.filterModel));
  }

  /**
   * Update filter (sliders and selections) with new domain values.
   *
   * Called when domain is changed.
   */
  private reset() {
    // this.filterModel = [];
    this.bypass = false;
    this.setDisabledState(false);
  }

  /**
   * Transform filters by removing those with values matching domain values
   *
   * @param filter {object}
   */
  private transformFilter(filter: object) {
    return Object.entries(filter).reduce((acc: any, [name, value]) => {
      if (filter[name].length === this.domain[name].length
        && this.domain[name].every((v, index) => v === value[index])) {
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
