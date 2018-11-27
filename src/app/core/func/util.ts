export function groupBy(xs: any[], key: string): any {
  return xs.reduce(function (acc, curr) {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {});
}
