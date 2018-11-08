import {and, domainOf, or, Predicate, rangify} from './index';
import {AggregateText} from '../models/maalfrid.model';
import * as moment from 'moment';

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


function shortTextCondition(): Predicate {
  return (e: AggregateText) => e.wordCount <= 3500;
}

function mediaType(contentType: string): string {
  return contentType.split(';')[0];
}

// establish domain/range of fields in dataset
function dominate(data) {
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

function predicatesFromFilters(filters): Predicate[] {
  const predicates = [];
  for (const [name, value] of Object.entries(filters)) {
    if (!value || (value as any[]).length === 0) {
      continue;
    }
    const predicate = predicateFromFilter(name, value);
    if (predicate) {
      predicates.push(predicate);
    }
  }
  return predicates;
}

function predicateFromFilter(name, value): Predicate {
  switch (name) {
    case 'language':
      return languageCondition(value);
    case 'contentType':
      return mimeCondition(value);
    case 'discoveryPath':
      return discoveryPathsCondition(value);
    case 'requestedUri':
      return urisCondition(value);
    case 'lix':
    case 'characterCount':
    case 'sentenceCount':
    case 'longWordCount':
    case 'wordCount':
      return rangeCondition(value, name);
    default:
      console.log('unhandled filter', name, value);
      return;
  }
}

export {
  dominate,
  predicatesFromFilters,
  longTextCondition,
  timeCondition,
  codeCondition,
  lixCondition,
  languageCondition,
  rangeCondition,
  uriCondition,
  urisCondition,
  mimeCondition,
  shortTextCondition,
  wordCondition,
  discoveryPathsCondition
};
