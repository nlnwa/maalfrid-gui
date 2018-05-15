export type Predicate = (e: any) => boolean;

export function and(predicates: Predicate[]): Predicate {
  return (e) => predicates.every(p => p(e));
}
