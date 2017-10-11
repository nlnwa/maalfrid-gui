import {HttpParams} from '@angular/common/http';

export class HttpUtil {
  static getParams(query): HttpParams {
    let params = new HttpParams();
    Object.keys(query).forEach((key) => {
      if (query[key] !== '') {
        params = params.append(key, query[key]);
      }
    });
    return params;
  }
}
