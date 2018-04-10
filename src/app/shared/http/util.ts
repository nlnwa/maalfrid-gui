import {HttpParams} from '@angular/common/http';

export function escapeRegExp(s: string): string {
  return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

export function createQueryParams(query): HttpParams {
  let params = new HttpParams();
  Object.keys(query).forEach((key) => {
    if (query[key] !== '') {
      if (query[key] instanceof Array) {
        query[key].forEach((value) => {
          params = params.append(key, value);
        });
      } else {
        params = params.append(key, query[key]);
      }
    }
  });
  return params;
}
