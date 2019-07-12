import {isSameDay, isSameMonth, isSameQuarter, isSameWeek, isSameYear} from 'date-fns';

export enum Granularity {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export function groupBy(xs: any[], key: string): any {
  return xs.reduce((acc, curr) => {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {});
}

export function getUTCDate(date = new Date()) {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}

export const isSame = {
  [Granularity.DAY]: isSameDay,
  [Granularity.WEEK]: isSameWeek,
  [Granularity.MONTH]: isSameMonth,
  [Granularity.QUARTER]: isSameQuarter,
  [Granularity.YEAR]: isSameYear,
};
