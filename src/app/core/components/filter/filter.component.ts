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
  filterChange: EventEmitter<Filter[]> = new EventEmitter();

  @Output()
  setGlobalFilter: EventEmitter<Filter[]> = new EventEmitter();

  @Output()
  setSeedFilter: EventEmitter<Filter[]> = new EventEmitter();

  uriRegexpModel = '';
  uriRegexpExclusive = false;

  constructor() {}

  get visible(): boolean {
    return !!this.domain;
  }

  getFilters(): Filter[] {
    return this.filters;
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
    this.setGlobalFilter.emit(this.filters);
    this.reset();
  }

  onSetSeedFilter() {
    this.setSeedFilter.emit(this.filters);
    this.reset();
  }

  onReset() {
    this.reset();
  }

  onFilterChange(filter: Filter) {
    // remove filter with same name if already present in filters array
    this.removeNamedFilterIfPresent(filter);
    // add filter if value not in domain
    if (!this.filterEqualsDomain(filter) && filter.value.length > 0) {
      this.filters.push(filter);
    }
    this.filterChange.emit(this.filters);
  }

  private removeNamedFilterIfPresent(filter: Filter) {
    const index = this.filters.findIndex((_) => _.name === filter.name);
    if (index > -1) {
      this.filters.splice(index, 1);
    }
  }

  /**
   * Update filter (sliders and selections) with new domain values.
   *
   * Called when domain is changed.
   */
  private reset() {
    this.filters = [];
    this.filterChange.emit(this.filters);
    Object.keys(this.domain).forEach((name) => {
      this[name].next({name, label: this.label[name], domain: this.domain[name]});
    });
    this.uriRegexpModel = '';
    this.uriRegexpExclusive = false;
  }

  /**
   * Check if filter value is similar to domain
   *
   * @param filter {Filter}
   */
  private filterEqualsDomain(filter: Filter): boolean {
    // filter name not in domain (e.g. matchRegexp)
    if (!this.domain.hasOwnProperty(filter.name)) {
      return false;
    }
    // check if filter has every value selected (select type filter)
    // or if filter value equals domain range (slider type filter)
    return this.domain[filter.name].every((value, index) => value === filter.value[index]);
  }
}
