import {AggregateText, Filter} from '../models/maalfrid.model';
import * as moment from 'moment';

export type Predicate = (e: any) => boolean;

export function or(predicates: Predicate[]): Predicate {
  return (e) => predicates.some(p => p(e));
}

export function and(predicates: Predicate[]): Predicate {
  return (e) => predicates.every(p => p(e));
}

export function rangify(bounds, value): number[] {
  if (value === undefined) {
    return bounds;
  }
  return [Math.min(bounds[0], value), Math.max(bounds[1], value)];
}

export function domainOf(uri: string) {
  const match = /(^[a-z]+:\/\/[^/]+)/.exec(uri);
  return match.length ? match[0] : '';
}

function not(predicate: Predicate): Predicate {
  return (e) => !predicate(e);
}

/**
 * Compares two pairs (ranges) of numbers
 *
 * @param a {number}
 * @param b {number}
 * @return {boolean} true if equal, false if not
 */
export function rangeIsEqual(a: number[], b: number[]) {
  return a[0] === b[0] && a[1] === b[1];
}

function trueCondition(): Predicate {
  return (e: AggregateText) => true;
}

function longTextCondition(): Predicate {
  return (e: AggregateText) => !shortTextCondition()(e);
}

function timeCondition(time: number, granularity: string): Predicate {
  const t = moment.unix(time).utc();
  return (e: AggregateText) => moment(e.endTime).isSame(t, granularity as any);
}

function codeCondition(code: string): Predicate {
  return (e: AggregateText) => e.language === code;
}

function lixCondition(range: number[]): Predicate {
  return rangeCondition(range, 'lix');
}

function languageCondition(languages: string[]): Predicate {
  return or(languages.map((code) => codeCondition(code)));
}

function discoveryPathsCondition(discoveryPaths: string[]): Predicate {
  return (e: AggregateText) => discoveryPaths.some((path) => {
    if (path === '') {
      return !e.hasOwnProperty('discoveryPath');
    } else {
      return e.discoveryPath === path;
    }
  });
}

function wordCondition(range: number[]) {
  return rangeCondition(range, 'wordCount');
}

function mimeCondition(texts: string[]): Predicate {
  return (e: AggregateText) => texts.some((text) => e.contentType.startsWith(text));
}

function rangeCondition(range: number[], property: string): Predicate {
  return (e: AggregateText) => e[property] >= range[0] && e[property] <= range[1];
}

function uriCondition(text: string): Predicate {
  return (e: AggregateText) => new RegExp(`${text}`).test(e.requestedUri);
}

function urisCondition(uris: string[]): Predicate {
  return or(uris.map((uri) => uriCondition(uri)));
}

function regexpCondition(regexp: string, property: string): Predicate {
  return (e: AggregateText) => {
    try {
      return new RegExp(`${regexp}`).test(e[property]);
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }
}

function shortTextCondition(): Predicate {
  return (e: AggregateText) => e.wordCount <= 3500;
}

function mediaType(contentType: string): string {
  return contentType ? contentType.split(';')[0] : '';
}

// establish domain/range of fields in dataset
export function dominate(data) {
  if (!data || data.length === 0) {
    return null;
  }
  const domain = data.reduce((acc: AggregateText | any, curr: AggregateText) => {
      acc.contentType.add(mediaType(curr.contentType));
      acc.language.add(curr.language);
      acc.discoveryPath.add(curr.discoveryPath || '');
      acc.requestedUri.add(domainOf(curr.requestedUri));
      acc.lix = rangify(acc.lix, curr.lix);
      acc.characterCount = rangify(acc.characterCount, curr.characterCount);
      acc.sentenceCount = rangify(acc.sentenceCount, curr.sentenceCount);
      acc.longWordCount = rangify(acc.longWordCount, curr.longWordCount);
      acc.wordCount = rangify(acc.wordCount, curr.wordCount);
      return acc;
    },
    {
      requestedUri: new Set(),
      contentType: new Set(),
      language: new Set(),
      discoveryPath: new Set(),
      lix: [Number.MAX_SAFE_INTEGER, 0],
      characterCount: [Number.MAX_SAFE_INTEGER, 0],
      sentenceCount: [Number.MAX_SAFE_INTEGER, 0],
      longWordCount: [Number.MAX_SAFE_INTEGER, 0],
      wordCount: [Number.MAX_SAFE_INTEGER, 0],
    });
  // convert all sets to arrays
  for (const name of Object.keys(domain)) {
    if (domain[name] instanceof Set) {
      domain[name] = Array.from(domain[name]);
    }
  }
  return domain;
}

export function predicateFromFilters(filters: Filter[]): Predicate {
  return and(predicatesFromFilters(filters));
}

function predicatesFromFilters(filters: Filter[]): Predicate[] {
  return filters.map(predicateFromFilter);
}

function predicateFromFilter(filter: Filter): Predicate {
  const {name, field, exclusive, value} = filter;
  let predicate;

  switch (name) {
    case 'language':
      predicate = languageCondition(value);
      break;
    case 'contentType':
      predicate = mimeCondition(value);
      break;
    case 'discoveryPath':
      predicate = discoveryPathsCondition(value);
      break;
    case 'requestedUri':
      predicate = urisCondition(value);
      break;
    case 'lix':
    case 'characterCount':
    case 'sentenceCount':
    case 'longWordCount':
    case 'wordCount':
      predicate = rangeCondition(value, name);
      break;
    case 'matchRegexp':
      predicate = regexpCondition(value, field);
      break;
    default:
      console.log('unhandled filter', name, value);
      return trueCondition();
  }

  return exclusive ? not(predicate) : predicate;
}
