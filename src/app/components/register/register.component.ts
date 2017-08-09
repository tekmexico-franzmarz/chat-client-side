import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register/register.service';
import { forbiddenNameValidator } from '../../directives/forbidden-name.directive';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';
import { NewUserInterface } from '../../interfaces/users';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  currentDate: Number = Date.now();
  newUserModel: NewUserInterface = {
    fullName: "",
    email: "",
    username: "",
    password: "",
    locale: "",
    status: "online",
    conversations: [],
    contacts: [],
    notifications: [{ typeNotif: "user-config", from: "admin", content: "Please update your Username", date: Date.now() }],
    groups: [],
    token: "",
    createdAt: this.currentDate,
    updatedAt: this.currentDate
  } as NewUserInterface;
  registerFormSubscription$: Subscription;
  signupFormSubscription$: Subscription;

  constructor(private router: Router,
    @Inject(LOCALE_ID) public localeId: string,
    private registerService: RegisterService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.signupForm = this.fb.group({
      'fullName': [this.newUserModel.fullName,
      [Validators.required,
      Validators.minLength(3),
      forbiddenNameValidator(/admin/i)]
      ],
      'email': [this.newUserModel.email,
      [Validators.required,
      Validators.email]
      ],
      'passwords': this.fb.group({
        'password': [this.newUserModel.password]
        ,
        'confirmPassword': [],
      }, { validator: this.areEqual })
    });

    this.signupFormSubscription$ = this.signupForm.valueChanges
      .subscribe(data => this.onValueChanged());

    this.onValueChanged();
  }
  areEqual(group: FormGroup): any {
    let res = {};
    let password = group.get('password').value; // to get value in input tag
    let confirmPassword = group.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      res["areEqual"] = true;
    } else if (password && password.length < 6) {
      res["minlength"] = true;
    }
    else {
      return null
    }
    return res;
  }

  register(): void {
    this.newUserModel.fullName = this.signupForm.value.fullName;
    this.newUserModel.locale = this.localeId;
    this.newUserModel.email = this.signupForm.value.email;
    this.newUserModel.username = this.signupForm.value.email;
    this.newUserModel.password = this.signupForm.value.passwords.password;

    console.log("User data to register=>",this.newUserModel);

    this.registerFormSubscription$ = this.registerService.createUser(this.newUserModel)
      .subscribe(
      data => {
        this.router.navigate(['login']);
      },
      error => { console.log(error) },
      () => console.log("Done")
      )
  }

  onValueChanged(data?: any): void {
    if (!this.signupForm) { return; }
    const form = this.signupForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
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


  ngOnDestroy() {
    if (this.registerFormSubscription$) this.registerFormSubscription$.unsubscribe();
    if (this.signupFormSubscription$) this.signupFormSubscription$.unsubscribe();
  }

  formErrors: { fullName: String, 'email': String, 'passwords': String } = {
    'fullName': '',
    'email': '',
    'passwords': ''
  };

  validationMessages: {
    'fullName':
    {
      'required': String,
      'minlength': String,
      'forbiddenName': String
    },
    'email':
    {
      'required': String,
      'email': String
    },
    'passwords': {
      'areEqual': String, 'minlength': String
    }
  } = {
    'fullName': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 3 characters long.',
      'forbiddenName': '"Admin" is not a valid name.'
    },
    'email': {
      'required': 'E-mail is required.',
      'email': 'Enter a valid e-mail address.'
    },
    'passwords': {
      'areEqual': 'Passwords must match',
      'minlength': "Password must be at least 6 characters long."
    }
  };

}
