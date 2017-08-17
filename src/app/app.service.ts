import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class AppService {

  private statsurl = 'http://158.39.123.14:3002/api/stats';
  stringen;

  constructor(private http: Http) {
  }

  getStats(url, lix, wc) {
    return this.http.get(`${this.statsurl}/${url}`); ///url/${url}/lix/${lix}/wc/${wc}`);
  }

}
