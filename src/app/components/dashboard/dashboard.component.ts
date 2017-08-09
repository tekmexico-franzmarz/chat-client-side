import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';

import { Router,ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data/data.service';
import { BroadcastService } from '../../services/broadcast/broadcast.service';

import { MyProfileDataInterface } from '../../interfaces/users';

import * as jQuery from 'jquery';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  msgFromServer;
  filteredContact;
  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private broadcastService: BroadcastService) { }

  ngOnInit() {
    console.log("Starting dashboard...");
    console.log("Inside Dashboard || locale_Id=", this.localeId);
    if (!this.dataService.getMyProfile()) {
      let myProfile = this.route.snapshot.data["loadedProfile"]
      console.log("Loading profile: ", myProfile);
      if(myProfile.locale!==this.localeId) window.location.href = `http://localhost:3000/${myProfile.locale}/#/dashboard`;
      myProfile.conversations.forEach((conv) => {
        //console.log(">> Checking conversation=", conv);
        //console.log(">> Checking conversation || myProfile._id=", myProfile._id);
        this.filteredContact = this.filterParticipant(conv.participants, myProfile._id)
        //console.log(">> this.filteredContact=", this.filteredContact);
        conv.participants = this.filteredContact;
      });
      //console.log(">> AFTER FILTERING || myProfile.conversations=", myProfile.conversations);
      this.dataService.shallowProfileUpdate(myProfile);

      this.broadcastService.connectToServer(myProfile._id)
      /* this.broadcastService.on("user-loggedin",(userId)=>{
        console.info("++++++++ BROADCASTED: User "+userId+" has logged in +++++++++++++")
        this.msgFromServer="User "+userId+" has logged in"
      })
      window.setTimeout(function () {
            jQuery(".alert").fadeTo(500, 0).slideUp(500, function () {
              jQuery(this).remove();
            });
          }, 4000);
      this.broadcastService.broadcast("user-loggedin",myProfile._id); */

    }
  }

  filterParticipant(arr, myId) {
    /*console.log(">> Inside filterParticipant || arr=", arr);
    console.log(">> Inside filterParticipant || arr[0]._id=", arr[0]._id);
    console.log(">> Inside filterParticipant || myId=", myId);*/
    return arr.filter(participant => participant._id !== myId)
  }

}
