/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 * Copyright (c) 2017 Nasjonalbiblioteket
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, Injectable, Optional} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import * as moment from 'moment';
import {Moment} from 'moment';

/** Whether the browser supports the Intl API. */
const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

/** The default month names to use if Intl API is not available. */
const DEFAULT_MONTH_NAMES = {
  'long': [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ],
  'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
};


/** The default date names to use if Intl API is not available. */
const DEFAULT_DATE_NAMES = range(31, i => String(i + 1));


/** The default day of the week names to use if Intl API is not available. */
const DEFAULT_DAY_OF_WEEK_NAMES = {
  'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

/**
 * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
 * other browsers do not. We remove them to make output consistent and because they interfere with
 * date parsing.
 * @param str The string to strip direction characters from.
 * @returns The stripped string.
 */
function stripDirectionalityCharacters(str: string) {
  return str.replace(/[\u200e\u200f]/g, '');
}

@Injectable()
export class MomentDateAdapter extends DateAdapter<Moment> {

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string) {
    super();
    super.setLocale(matDateLocale);
    moment.locale(this.locale);
  }

  getYear(date: Moment): number {
    return date.year();
  }

  getMonth(date: Moment): number {
    return date.month();
  }

  getDate(date: Moment): number {
    return date.date();
  }

  getDayOfWeek(date: Moment): number {
    return date.weekday();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (SUPPORTS_INTL_API) {
      const dtf = new Intl.DateTimeFormat(this.locale, {month: style});
      return range(12, i => stripDirectionalityCharacters(dtf.format(new Date(2017, i, 1))));
    }
    return DEFAULT_MONTH_NAMES[style];
  }

  getDateNames(): string[] {
    if (SUPPORTS_INTL_API) {
      const dtf = new Intl.DateTimeFormat(this.locale, {day: 'numeric'});
      return range(31, i => stripDirectionalityCharacters(
        dtf.format(new Date(2017, 0, i + 1))));
    }
    return DEFAULT_DATE_NAMES;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (SUPPORTS_INTL_API) {
      const dtf = new Intl.DateTimeFormat(this.locale, {weekday: style});
      return range(7, i => stripDirectionalityCharacters(
        dtf.format(new Date(2017, 0, i + 1))));
    }
    return DEFAULT_DAY_OF_WEEK_NAMES[style];
  }

  getYearName(date: Moment): string {
    if (SUPPORTS_INTL_API) {
      const dtf = new Intl.DateTimeFormat(this.locale, {year: 'numeric'});
      return stripDirectionalityCharacters(dtf.format(date.toDate()));
    }
    return String(this.getYear(date));
  }

  getFirstDayOfWeek(): number {
    return moment.localeData(this.locale).firstDayOfWeek();
  }

  getNumDaysInMonth(date: Moment): number {
    return date.daysInMonth();
  }

  clone(date: Moment): Moment {
    return date.clone();
  }

  createDate(year: number, month: number, date: number): Moment {
    return moment([year, month, date]);
  }

  today(): Moment {
    return moment();
  }

  parse(value: any, parseFormat: any): Moment {
    return moment(value, parseFormat);
  }

  format(date: Moment, displayFormat: any): string {
    return date.format(displayFormat);
  }

  addCalendarYears(date: Moment, years: number): Moment {
    return date.add(years, 'years');
  }

  addCalendarMonths(date: Moment, months: number): Moment {
    return date.add(months, 'months');
  }

  addCalendarDays(date: Moment, days: number): Moment {
    return date.add(days, 'days');
  }

  toIso8601(date: Moment): string {
    return date.toISOString();
  }

  fromIso8601(iso8601String: string): Moment | null {
    const m = moment(iso8601String);
    return m.isValid() ? m : null;
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: Moment): boolean {
    return date.isValid();
  }

}
