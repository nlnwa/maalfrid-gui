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

  private filters: Filter[] = [];

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

  @Input()
  domain: AggregateText[] | any;

  @Output()
  change: EventEmitter<Filter[]> = new EventEmitter();

  @Output()
  setGlobalFilter: EventEmitter<Filter[]> = new EventEmitter();

  @Output()
  setSeedFilter: EventEmitter<Filter[]> = new EventEmitter();

  constructor() {}

  get visible(): boolean {
    return !!this.domain;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domain) {
      if (this.domain) {
        this.reset();
      } else {
        this.domain = undefined;
      }
    }
  }

  onSetGlobalFilter() {

  }

  onSetSeedFilter() {

  }

  onReset() {
    this.reset();
    this.change.emit([]);
  }

  onFilterChange(value, name) {
    console.log(value);
    const index = this.filters.findIndex((filter) => filter.name === name);
    if (index > -1) {
      this.filters.splice(index, 1);
    }
    this.filters.push({name, value});

    this.change.emit(this.filters);
    // this.change.emit(this.transformFilter(this.filterModel));
  }

  /**
   * Update filter (sliders and selections) with new domain values.
   *
   * Called when domain is changed.
   */
  private reset() {
    this.filters = [];
    Object.keys(this.domain).forEach((_) => {
      this[_].next({
        name: this.label[_],
        domain: this.domain[_]
      });
    });
  }

  /**
   * Transform filters by removing those with values matching domain values
   *
   * @param model {object}
   */
  private transformFilter(model: object) {
    return Object.entries(model).reduce((acc: any, [name, value]) => {
      if (model[name].length === this.domain[name].length
        && this.domain[name].every((v, index) => v === value[index])) {
        return acc;
      } else if (model[name].length === 0) {
        return acc;
      } else {
        acc[name] = model[name];
        return acc;
      }
    }, {});
  }
}
