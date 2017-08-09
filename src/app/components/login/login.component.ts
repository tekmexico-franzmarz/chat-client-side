import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login/login.service';
import { DataService } from '../../services/data/data.service';

import { MyProfileDataInterface } from '../../interfaces/users';

import * as jQuery from 'jquery';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: NgForm;
  @ViewChild('loginForm') currentForm: NgForm;

  userToken: string;
  userProfile: MyProfileDataInterface;
  credentials: { email: String, password: String } = { email: '', password: '' };
  alertMessage: String = "";

  loginFormSubscription$: Subscription;
  loginServiceSubscription$: Subscription;

  constructor(private router: Router, private loginService: LoginService, private dataService: DataService) { }

  ngAfterViewChecked(): void {
    this.formChanged();
  }
  formChanged(): void {
    if (this.currentForm === this.loginForm) { return; }
    this.loginForm = this.currentForm;
    if (this.loginForm) {
      this.loginFormSubscription$ = this.loginForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any): void {
    if (!this.loginForm) { return; }
    const form = this.loginForm.form;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  formErrors: { email: String } = {
    'email': ''
  };
  validationMessages: { email: { required: String, pattern: String } } = {
    'email': {
      'required': 'E-mail is required.',
      'pattern': 'Enter a valid e-mail address.'
    }
  };
  loginFn(): void {
    var date: Date = new Date();
    this.loginServiceSubscription$ = this.loginService.auth(this.credentials)
      .subscribe(
      res => {
        this.userToken = res._body;
        if (!sessionStorage.getItem("userToken")) sessionStorage.setItem("userToken", "")
        sessionStorage.setItem("userToken", this.userToken);
        console.log("User Token=>", sessionStorage.getItem("userToken"))
        this.router.navigate(['dashboard'])
      },
      err => {
        if (err.statusText == "Unauthorized") {
          this.alertMessage = "Username or Password"
          window.setTimeout(function () {
            jQuery(".alert").fadeTo(500, 0).slideUp(500, function () {
              jQuery(this).remove();
            });
          }, 4000);
        };
      },
      () => console.log('Finished Log In')
      )
  }
  ngOnDestroy() {
    if (this.loginServiceSubscription$) this.loginServiceSubscription$.unsubscribe();
    if (this.loginFormSubscription$) this.loginFormSubscription$.unsubscribe();
  }

}
