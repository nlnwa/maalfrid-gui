import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import 'rxjs/add/operator/timeoutWith';
import {Observable} from "rxjs";
import {environment} from '../environments/environment';


@Injectable()
export class AppService {

  private API_URL = environment.API_URL;



  constructor(private http: Http) {
  }




  getStats(form) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('url', form.url);
    params.set('lix', form.lix);
    params.set('wc', form.wc);
    params.set('cc', form.cc);
    params.set('lwc', form.lwc);
    params.set('sc', form.sc);

    console.log(`${this.API_URL}/stats`, {search: params});
    return this.http.get(`${this.API_URL}/stats`,
                         {search: params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }


  getLang(form) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('code', form.code);
    params.set('url', form.lngurl);

    console.log(`${this.API_URL}/language`, {search: params});
    return this.http.get(`${this.API_URL}/language`,
                         {search: params})
      .timeoutWith(20000, Observable.throw(new Error('Timeout')));
  }

}
