import {MatDateFormats} from '@angular/material';

export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
