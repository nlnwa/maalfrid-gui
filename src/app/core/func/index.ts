export type Predicate = (e: any) => boolean;

export function or(predicates: Predicate[]): Predicate {
  console.log(predicates);
  return (e) => predicates.some(p => p(e));
}

export function and(predicates: Predicate[]): Predicate {
  console.log(predicates);
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
