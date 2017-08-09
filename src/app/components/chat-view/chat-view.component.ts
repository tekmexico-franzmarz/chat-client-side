import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { DataService } from '../../services/data/data.service';
import { ChatService } from '../../services/chat/chat.service';
import { BroadcastService } from '../../services/broadcast/broadcast.service';

import { MyProfileDataInterface } from '../../interfaces/users';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {
  param: any;
  contactId: string;
  myProfile: MyProfileDataInterface;
  conversationId;
  conversationConfig;
  chat;
  arrMessages: Array<{}> = [];
  chatTemplate = {
    _id: "",
    conversationName: "",
    conversationType: "",
    createdAt: 0,
    owner: "",
    participants: []
  }
  filteredContact;


  public participantsForm: FormGroup;

  paramMapSubscription$: Subscription;
  findConversationSubscription$: Subscription;
  createConversationSubscription$: Subscription;

  @ViewChild("myCanvas") myCanvas;

  context: CanvasRenderingContext2D;
  pos = { x: 0, y: 0 };
  canvas;
  rect;
  scribble;

  constructor(private broadcastService: BroadcastService,
    private dataService: DataService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
    this.myProfile = this.dataService.getMyProfile();
    this.paramMapSubscription$ = route.paramMap.subscribe(params => {
      this.param = params;
      this.conversationId = this.param.params.conversationId;
      this.chat = this.chatTemplate;
      this.arrMessages = [];
      this.conversationConfig = null;
      this.myProfile = this.dataService.getMyProfile();
      this.chatService.fetchConversation(this.conversationId).subscribe(
        (data: any) => {
          this.chat = JSON.parse(data._body);
          //console.log("Fetched Conversation=", this.chat);
          for (let i = 0; i < this.chat.messages.length; i++) {
            if (this.chat.messages[i].userId == this.myProfile._id) {
              this.chat.messages[i].position = "right"
            } else {
              this.chat.messages[i].position = "left"
            }
            this.arrMessages.push(this.chat.messages[i]);
          }

        }, err => {
          console.log("Error during query || err=", err);
        },
        () => console.log('Done')
      )
    })

    this.broadcastService.on("add-message-inDOM", (message) => {
      console.info("++++++++ BROADCASTED: Message received: ", message)
      message.position = "left"
      this.arrMessages.push(message)
    })
  };

  ngAfterViewInit() {
    this.canvas = this.myCanvas.nativeElement;
    this.rect = this.canvas.getBoundingClientRect();
    this.context = this.canvas.getContext("2d");
    // last known position
    this.pos = { x: 0, y: 0 };
  }
  draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    this.rect = this.canvas.getBoundingClientRect();
    if (!this.pos.x && !this.pos.y) {
      this.pos.x = Math.round((e.clientX - this.rect.left) / (this.rect.right - this.rect.left) * this.canvas.width);
      this.pos.y = Math.round((e.clientY - this.rect.top) / (this.rect.bottom - this.rect.top) * this.canvas.height);
    }
    this.context.beginPath(); // begin

    this.context.lineWidth = 5;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#c0392b';

    this.context.moveTo(this.pos.x, this.pos.y); // from
    this.pos.x = Math.round((e.clientX - this.rect.left) / (this.rect.right - this.rect.left) * this.canvas.width);
    this.pos.y = Math.round((e.clientY - this.rect.top) / (this.rect.bottom - this.rect.top) * this.canvas.height);
    this.context.lineTo(this.pos.x, this.pos.y); // to
    this.context.stroke(); // draw it!
  }
  closeMyPath(e) {
    this.context.closePath();
    this.pos = { x: 0, y: 0 };
  }
  saveDrawing() {
    this.scribble = this.canvas.toDataURL();
    console.log("Saved Scribble=", this.scribble);
    let obj = {
      msgContent: this.scribble,
      createdAt: Date.now(),
      msgType: "image",
      userId: this.myProfile._id,
      conversationId: this.conversationId
    }
    this.chatService.sendMessage(obj).subscribe((data) => {
      var contactId: String;
      this.filteredContact = this.filterParticipant(this.chat.participants, this.myProfile._id)
      this.broadcastService.confirmMsgToServer(obj, this.filteredContact);
      obj["position"] = "right"
      this.arrMessages.push(obj);
    },
      (err) => err,
      () => console.log("Done"));
  }


  filterParticipant(arr, myId) {
    return arr.filter(participant => participant._id !== myId)
  }

  sendTextMsg(msg) {
    let obj = {
      msgContent: msg,
      msgType: "text",
      createdAt: Date.now(),
      userId: this.myProfile._id,
      conversationId: this.conversationId
    }
    this.chatService.sendMessage(obj).subscribe((data) => {
      var contactId: String;
      //console.log("Message DB updated || data=",data)
      this.filteredContact = this.filterParticipant(this.chat.participants, this.myProfile._id)
      //console.log("Contact ID=",this.filteredContact)
      this.broadcastService.confirmMsgToServer(obj, this.filteredContact);
      obj["position"] = "right"
      this.arrMessages.push(obj);
    },
      (err) => err,
      () => console.log("Done"));
  }

  ngOnInit() {
    this.myProfile = this.dataService.getMyProfile();
    this.buildForm();
  }

  buildForm(): void {
    this.participantsForm = this.fb.group({
      'selectedContacts': this.fb.array(
        this.myProfile.contacts.map(c => new FormControl(false)))
    });
  }
  saveParticipants() {
    let selection = this.participantsForm.controls.selectedContacts.value;
    let selectedContacts = [];
    /* console.log("Inside SaveParticipants || this.participantsForm=", this.participantsForm.controls.selectedContacts.value);
    console.log("Inside SaveParticipants || this.myProfile=", this.myProfile);
    console.log("Inside SaveParticipants || this.conversationId=", this.conversationId); */
    for (let i = 0; i < selection.length; i++) {
      if (selection[i]) {
        selectedContacts.push(this.myProfile.contacts[i]._id);
      }
    }
    console.log("Inside SaveParticipants || selectedContacts=", selectedContacts);
    this.chatService.updateGroupParticipants(selectedContacts, this.conversationId)
      .subscribe((data) => {
        if (data.status == 200) {
          for (let j = 0; j < selection.length; j++) {
            if (selection[j]) {
              console.log("this.chat.participants=>", this.chat.participants);
              console.log("About to add=>", this.myProfile.contacts[j]);
              this.chat.participants.push(this.myProfile.contacts[j]);
            }
          }
        }
      },
      (err) => err,
      () => console.log("Done"));
  }

  getParticipants(participantsForm) {
    return participantsForm.get('selectedContacts').controls
  }

  ngOnDestroy() {
    if (this.paramMapSubscription$) this.paramMapSubscription$.unsubscribe();
    if (this.findConversationSubscription$) this.findConversationSubscription$.unsubscribe();
    if (this.createConversationSubscription$) this.createConversationSubscription$.unsubscribe();
  }

}
