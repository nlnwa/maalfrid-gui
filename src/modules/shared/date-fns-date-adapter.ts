import {Inject, Injectable} from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';
import {
  addDays,
  addMonths,
  addYears,
  format,
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  isDate,
  isValid,
  parse,
  setDay,
  setMonth,
  toDate
} from 'date-fns';
import * as nb from 'date-fns/locale/nb';

const DATE_FNS_LOCALE = {
  nb
};

// CONFIG. Use environment or something for a dynamic locale and settings

const WEEK_STARTS_ON = 1; // 0 sunday, 1 monday...

export const MAT_DATE_FNS_DATE_FORMATS = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'LLL y',
    dateA11yLabel: 'MMMM d, y',
    monthYearA11yLabel: 'MMMM y',
  }
};

// in app.module.ts:
/*
{
  provide: DateAdapter,
  useClass: DateFnsDateAdapter
},
{
  provide: MAT_DATE_FORMATS,
  useValue: MAT_DATE_FNS_DATE_FORMATS
},
 */

function range(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
}

@Injectable()
export class DateFnsDateAdapter extends DateAdapter<Date> {

  private readonly formatOptions;

  constructor(@Inject(MAT_DATE_LOCALE) protected matDateLocale: string) {
    super();
    const locale = DATE_FNS_LOCALE[matDateLocale];
    this.formatOptions = locale ? {locale} : {};
  }

  addCalendarDays(date: Date, days: number): Date {
    return addDays(date, days);
  }

  addCalendarMonths(date: Date, months: number): Date {
    return addMonths(date, months);
  }

  addCalendarYears(date: Date, years: number): Date {
    return addYears(date, years);
  }

  clone(date: Date): Date {
    return toDate(date);
  }

  createDate(year: number, month: number, date: number): Date {
    return new Date(year, month, date);
  }

  format(date: Date, displayFormat: any): string {
    return format(date, displayFormat, this.formatOptions);
  }

  getDate(date: Date): number {
    return getDate(date);
  }

  getDateNames(): string[] {
    return range(1, 31).map(day => String(day));
  }

  getDayOfWeek(date: Date): number {
    return parseInt(format(date, 'i'), 10);
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const map = {
      long: 'EEEE',
      short: 'E..EEE',
      narrow: 'EEEEE'
    };

    const formatStr = map[style];
    const date = new Date();

    return range(0, 6).map(month => format(setDay(date, month), formatStr, this.formatOptions));
  }

  getFirstDayOfWeek(): number {
    return WEEK_STARTS_ON;
  }

  getMonth(date: Date): number {
    return getMonth(date);
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const map = {
      long: 'LLLL',
      short: 'LLL',
      narrow: 'LLLLL'
    };

    const formatStr = map[style];
    const date = new Date();

    return range(0, 11).map(month => format(setMonth(date, month), formatStr, this.formatOptions));
  }

  getNumDaysInMonth(date: Date): number {
    return getDaysInMonth(date);
  }

  getYear(date: Date): number {
    return getYear(date);
  }

  getYearName(date: Date): string {
    return format(date, 'yyyy', this.formatOptions);
  }

  invalid(): Date {
    return new Date(NaN);
  }

  isDateInstance(obj: any): boolean {
    return isDate(obj);
  }

  isValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  parse(value: any, parseFormat: any): Date | null {
    const date = parse(value, parseFormat, new Date(), this.formatOptions);
    return isValid(date) ? date : null;
  }

  toIso8601(date: Date): string {
    return date.toISOString();
  }

  today(): Date {
    return new Date();
  }
}
