import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/observable/throw';
import {environment} from '../environments/environment';


@Injectable()
export class AppService {

  private API_URL: string = environment.API_URL;


  constructor(private http: Http) {
  }


  getStats(form) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('url', form.url);
    params.set('lix', form.lix);
    params.set('wc', form.wc);
    params.set('cc', form.cc);
    params.set('lwc', form.lwc);
    params.set('sc', form.sc);

    return this.http.get(
      `${this.API_URL}/stats`,
      {search: params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }


  getLang(form) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('code', form.code);
    params.set('url', form.lngurl);

    return this.http.get(
      `${this.API_URL}/language`,
      {search: params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }

}
