import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";

import { DataService } from "../../services/data/data.service";

import { MyProfileDataInterface } from "../../interfaces/users";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  public myProfile: MyProfileDataInterface;
  public profileSettingsForm: FormGroup;
  public languagesForm: FormGroup;
  public availableLanguages: Array<{ name: string; locale: string }> = [
    { name: "English", locale: "en" },
    { name: "Español", locale: "es" }
  ];
  public settingsData: {
    myId:String;
    usernameSetting: String;
    passwordSetting: String;
    languageSetting: String;
  } = { myId: "",usernameSetting: "", passwordSetting: "", languageSetting: "" };

  constructor(
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.myProfile = this.dataService.getMyProfile();
    console.log("Loaded profile in Settings=>", this.myProfile);
    this.buildForm();
  }

  buildForm(): void {
    this.profileSettingsForm = this.fb.group({
      username: [this.settingsData.usernameSetting, [Validators.minLength(4)]],
      passwords: this.fb.group(
        {
          password: [this.settingsData.passwordSetting],
          confirmPassword: []
        },
        { validator: this.areEqual }
      )
    });

    this.languagesForm = this.fb.group({
      selectedLanguage: ""
    });

    this.profileSettingsForm.valueChanges.subscribe(data =>
      this.onValueChanged()
    );
    this.onValueChanged();
  }

  areEqual(group: FormGroup): any {
    let res = {};
    let password = group.get("password").value; // to get value in input tag
    let confirmPassword = group.get("confirmPassword").value; // to get value in input tag
    if (password != confirmPassword) {
      res["areEqual"] = true;
    } else if (password && password.length < 6) {
      res["minlength"] = true;
    } else {
      return null;
    }
    return res;
  }
  onValueChanged(data?: any): void {
    if (!this.profileSettingsForm) {
      return;
    }
    const form = this.profileSettingsForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = "";
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + " ";
        }
      }
    }
  }
  formErrors: { "username": String; "passwords": String } = {
    username: "",
    passwords: ""
  };

  validationMessages: {
    "username": {
      "minlength": String;
    };
    "passwords": {
      "areEqual": String;
      "minlength": String;
    };
  } = {
    username: {
      minlength: "Name must be at least 3 characters long."
    },
    passwords: {
      areEqual: "Passwords must match",
      minlength: "Password must be at least 6 characters long."
    }
  };

  saveLanguage(languagesForm) {
    let selection = languagesForm.get("selectedLanguage").value;
    if(selection)this.settingsData.languageSetting=selection;
    console.log(">>>>Inside saveLanguage || selection=", selection);
  }

  updateProfile() {
    console.log("this.profileSettingsForm.get('username').value=", this.profileSettingsForm.get("username").value);
    console.log("this.profileSettingsForm.get('passwords.password').value=", this.profileSettingsForm.get('passwords.password').value);
    this.settingsData.myId=this.myProfile._id;
    if(this.profileSettingsForm.get("username").value)this.settingsData.usernameSetting=this.profileSettingsForm.get("username").value;
    if(this.profileSettingsForm.get("passwords.password").value)this.settingsData.passwordSetting=this.profileSettingsForm.get("passwords.password").value;
    console.log("This.settingsData=", this.settingsData);
    this.dataService.updateMyProfile(this.settingsData).subscribe(
      data => {
        console.log("Response from server=", data);
        this.myProfile=this.dataService.getMyProfile();
        console.log("My New Updated Profile=", this.myProfile);
        this.router.navigate(['./main'])
      }
    );
  }
}
