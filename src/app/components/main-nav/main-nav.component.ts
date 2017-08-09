import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data/data.service';
import { ChatService } from '../../services/chat/chat.service';
import { BroadcastService } from '../../services/broadcast/broadcast.service';

import { MyProfileDataInterface } from '../../interfaces/users';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  public myProfile: MyProfileDataInterface;
  conversationConfig;
  chat;
  filteredContact;
  chatTemplate = {
    _id: "",
    conversationName: "",
    conversationType: "",
    createdAt: 0,
    owner: "",
    participants: []
  }

  findConversationSubscription$: Subscription;
  createConversationSubscription$: Subscription;

  constructor(private dataService: DataService, private chatService: ChatService, private broadcastService: BroadcastService, private router: Router, private route: ActivatedRoute) { }

  findConversation(contact) {
    this.chatService.findConversation(this.myProfile._id, contact._id).subscribe(
      data => {
        this.chat=this.chatTemplate;
        this.conversationConfig = JSON.parse(data._body)[0];
        if (!this.conversationConfig) {
          this.conversationConfig = {
            conversationType:"P2P",
            conversationName : "",
            participants: [this.myProfile._id, contact._id],
            owner: this.myProfile._id
          }
          this.createConversationSubscription$ = this.chatService.createConversation(this.conversationConfig).subscribe((data) => {
            this.chat = JSON.parse(data._body);

            this.filteredContact = this.filterParticipant(this.chat.participants, this.myProfile._id)
            this.chat.participants = this.filteredContact;
            this.myProfile.conversations.push(this.chat);
            this.dataService.shallowProfileUpdate(this.myProfile);
            this.router.navigate(['./chat', this.chat._id], { relativeTo: this.route })
          })
        } else {
          this.chat = this.conversationConfig;
        }
        this.router.navigate(['./chat', this.chat._id], { relativeTo: this.route })
      },
      err => {
        console.log("Error during query || err=", err);
      },
      () => console.log('Finished search')
    );
  }
  filterParticipant(arr, myId) {
    return arr.filter(participant => participant._id !== myId)
  }
  showConversation(chat) {
    //"Inside ShowConversation || conversation=", chat);
    this.router.navigate(['./chat', chat._id], { relativeTo: this.route });
  }

  ngOnInit() {
    this.myProfile = this.dataService.getMyProfile();
    //console.log("Inside Main-Nav Component || this.myProfile",this.myProfile);
  }

}
