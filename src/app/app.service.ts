import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import { environment } from '../environments/environment'

@Injectable()
export class AppService {

  private API_URL = 'http://'+environment.API_URL;


  constructor(private http: Http) {
  }

  getStats(url, lix, wc) {

    const uri = encodeURIComponent(`${url}/${lix}/${wc}`);
    console.log("HttpRequest: "+`${this.API_URL}/${url}/${lix}/${wc}`);
    return this.http.get(`${this.API_URL}/${url}/${lix}/${wc}`); ///url/${url}/lix/${lix}/wc/${wc}`);


    //return JSON.parse('[{"key": "Norsk bokmål","value": 40},{"key": "Norsk nynorsk","value": 60}]')
  }

}
