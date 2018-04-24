import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Resolve} from '@angular/router';
import {AuthService} from './auth';


@Injectable()
export class AppResolver implements Resolve<Observable<string>> {

  constructor(private authService: AuthService) {
  }

  resolve(): Promise<any> {
    return this.authService.resolve();
  }
}
