import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AggregateText, Filter} from '../../models/maalfrid.model';
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
  characterCount$ = this.characterCount.asObservable();

  wordCount = new Subject<any>();
  wordCount$ = this.wordCount.asObservable();

  sentenceCount = new Subject<any>();
  sentenceCount$ = this.sentenceCount.asObservable();

  lix = new Subject<any>();
  lix$ = this.lix.asObservable();

  longWordCount = new Subject<any>();
  longWordCount$ = this.longWordCount.asObservable();

  contentType = new Subject<any>();
  contentType$ = this.contentType.asObservable();

  language = new Subject<any>();
  language$ = this.language.asObservable();

  discoveryPath = new Subject<any>();
  discoveryPath$ = this.discoveryPath.asObservable();

  requestedUri = new Subject<any>();
  requestedUri$ = this.requestedUri.asObservable();

  // bypasses filter if true
  bypass = false;


  disabled = false;

  @Input()
  domain: AggregateText[] | any;

  @Output()
  change: EventEmitter<Filter> = new EventEmitter();

  // @Output()
  // save: EventEmitter<FilterSet> = new EventEmitter();

  constructor() {}

  get bypassIcon(): string {
    return this.bypass ? 'visibility_off' : 'visibility';
  }

  get visible(): boolean {
    return !!this.domain;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domain) {
      if (this.domain) {
        Object.keys(this.domain).forEach((_) => {
          this[_].next({
            name: this.label[_],
            domain: this.domain[_]
          });
        });
        /*const range = {
          min: this.domain.characterCount[0],
          max: this.domain.characterCount[1]
        };
        this.characterCount.next({
          range,
          start: [range.min, range.max]
        });
        */
      } else {
        this.domain = undefined;
      }
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

  }

  onChange(value, name) {
    console.log(value, name);
    this.change.emit({name, value});
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
