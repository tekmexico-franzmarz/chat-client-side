import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { DataService } from '../../services/data/data.service';

import { MyProfileDataInterface } from '../../interfaces/users';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

interface notificationData {
  email: string,
  typeNotif: string,
  from: string,
  senderId: string,
  content: string,
  date: number
}

@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.scss']
})
export class ManageContactsComponent implements OnInit {

  private myProfile: MyProfileDataInterface;
  public data: notificationData = {
    email: "",  //bounded to input in the Form
    typeNotif: "",
    from: "",
    senderId: "",
    content: "",
    date: 0
  };
  alertMessage: string = "";
  addContactForm: NgForm;
  @ViewChild('addContactForm') currentForm: NgForm;

  serviceAddContactSubscription$:Subscription;
  addContactFormSubscription$:Subscription;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.myProfile = this.dataService.getMyProfile();
  }
  ngAfterViewChecked(): void {
    this.formChanged();
  }
  addContact() {
    this.data.typeNotif = "new-contact";
    this.data.from = this.myProfile.email;
    this.data.senderId = this.myProfile._id;
    this.data.content = `You have a new Contact Request from ${this.myProfile.fullName}`;
    this.data.date = Date.now();
    this.serviceAddContactSubscription$=this.dataService.addContact(this.data)
    .subscribe(
      res => {
        this.router.navigate(['dashboard'])
      },
      err => {
        if (err.statusText == "Unauthorized") this.alertMessage = "Username or Password";
      },
      () => console.log('Done')
    )
  }
  formChanged() {
    if (this.currentForm === this.addContactForm) { return; }
    this.addContactForm = this.currentForm;
    if (this.addContactForm) {
      this.addContactFormSubscription$=this.addContactForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any): void {
    if (!this.addContactForm) { return; }
    const form = this.addContactForm.form;
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

  formErrors: { email: string } = {
    'email': ''
  };

  validationMessages: { email: { required: string, pattern: string } } = {
    'email': {
      'required': 'E-mail is required.',
      'pattern': 'Enter a valid e-mail address.'
    }
  };

  ngOnDestroy(){
    if(this.serviceAddContactSubscription$)this.serviceAddContactSubscription$.unsubscribe();
    if(this.addContactFormSubscription$)this.addContactFormSubscription$.unsubscribe();
  }

}
