import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { DataService } from '../data/data.service';

@Injectable()
export class LoginService {

  constructor(private http: Http, private dataService:DataService) { }

  auth(credentials): Observable<any> {
    return this.http
      .post("/api/login", credentials)
      .map((res:Response) => res)
  }
}
