import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VeidemannService {

  constructor(private http: HttpClient) { }
}
