import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { LoginService } from '../login/login.service';
import { NewUserInterface } from '../../interfaces/users';

@Injectable()
export class RegisterService {

  constructor(private http: Http, private loginService: LoginService) { }

  createUser(user: NewUserInterface):Observable<any> {
    return this.http
      .post("/api/register/", user)
      .map((response: Response) => {});
  }
}
