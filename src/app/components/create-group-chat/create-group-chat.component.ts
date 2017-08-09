import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { DataService } from '../../services/data/data.service';
import { ChatService } from '../../services/chat/chat.service';
import { BroadcastService } from '../../services/broadcast/broadcast.service';

import { MyProfileDataInterface } from '../../interfaces/users';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss']
})
export class CreateGroupChatComponent implements OnInit {
  public myProfile: MyProfileDataInterface;
  private groupChatForm: FormGroup;
  public participantsForm: FormGroup;
  public chat;
  public groupData: { conversationName: String, participants: Array<{}>, conversationType: String, owner: String } = { conversationName: '', participants: [], conversationType: "group", owner: "" };

  groupChatFormSubscription$: Subscription;

  constructor(private dataService: DataService,
    private chatService: ChatService,
    private broadcastService: BroadcastService,
    private router: Router,
    private fb: FormBuilder) { }
  /*
    ngAfterViewChecked(): void {
      this.formChanged();
    }
    formChanged() {
      if (this.currentForm === this.groupChatForm) { return; }
      this.groupChatForm = this.currentForm;
      if (this.groupChatForm) {
        this.groupChatFormSubscription$ = this.groupChatForm.valueChanges
          .subscribe(data => this.onValueChanged(data));
      }
    }
    onValueChanged(data?: any): void {
      if (!this.groupChatForm) { return; }
      const form = this.groupChatForm.form;
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
     */

  ngOnInit() {
    this.myProfile = this.dataService.getMyProfile();
    console.log("Loaded profile in Create Group Chat=>", this.myProfile);
    this.buildForm();
  }

  buildForm(): void {
    this.groupChatForm = this.fb.group({
      'groupChatName': [this.groupData.conversationName,
        // [Validators.required]
      ]
    });

    this.participantsForm = this.fb.group({
      'selectedContacts': this.fb.array(
        this.myProfile.contacts.map(c => new FormControl(false)))
    });
    // this.groupChatFormSubscription$ = this.groupChatForm.valueChanges
    // .subscribe(data => this.onValueChanged());

    // this.onValueChanged();
  }

  onValueChanged(data?: any): void {

    // if (!this.groupChatForm) { return; }
    // const form = this.groupChatForm;

    // for (const field in this.formErrors) {
    //   // clear previous error message (if any)
    //   this.formErrors[field] = '';
    //   const control = form.get(field);

    //   if (control && control.dirty && !control.valid) {
    //     const messages = this.validationMessages[field];

    //     for (const key in control.errors) {
    //       this.formErrors[field] += messages[key] + ' ';
    //     }
    //   }
    // }
  }
  formErrors: { groupName: String } = {
    'groupName': ''
  };
  validationMessages: { groupName: { required: String } } = {
    'groupName': {
      'required': 'Group Name is required.'
    }
  };

  saveParticipants() {
    //let selection = this.participantsForm.controls.selectedContacts.value;
    let selection = this.participantsForm.get("selectedContacts").value;
    //console.log("Inside SaveParticipants || this.participantsForm=", this.participantsForm.controls.selectedContacts.value);
    for (let i = 0; i < selection.length; i++) {
      if (selection[i]) {
        this.groupData.participants.push(this.myProfile.contacts[i]);
      }
    }
    this.groupData.participants.push(this.myProfile);
  }

  createGroup() {
    /* console.log("Inside createGroup || this.groupChatForm=", this.groupChatForm.controls);
    console.log("Inside createGroup || this.groupData=", this.groupData); */
    this.groupData.owner = this.myProfile._id;
    this.chatService.createConversation(this.groupData).subscribe(
      data => {
        console.log("New Group Chat=", JSON.parse(data._body));
        this.chat = JSON.parse(data._body);
        this.myProfile.conversations.push(this.chat);
        this.dataService.shallowProfileUpdate(this.myProfile);
        //this.router.navigate(['./chat', this.chat._id]
      }
    );
  }

  getParticipants(participantsForm){
    return participantsForm.get('selectedContacts').controls
  }

  ngOnDestroy() {
    if (this.groupChatFormSubscription$) this.groupChatFormSubscription$.unsubscribe();
  }
}
