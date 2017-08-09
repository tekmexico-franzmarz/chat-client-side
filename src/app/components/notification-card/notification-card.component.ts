import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data/data.service';

import { MyProfileDataInterface } from '../../interfaces/users';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {
  public myProfile: MyProfileDataInterface;
  denyNotifSubscription$:Subscription;
  acceptNotifSubscription$:Subscription;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.myProfile = this.dataService.getMyProfile();
  }
  denyNotif(notifData) {
    //console.log("Inside DenyContactRequest function || notifData=", notifData);
    this.denyNotifSubscription$=this.dataService.denyRequest(notifData, this.myProfile._id)
      .subscribe(
      res => {
        //console.log("Final this.myProfile.notifications || this.dataService.getMyProfile().notifications=", this.dataService.getMyProfile().notifications);
      },
      err => { return err },
      () => console.log('Done')
      )
  }
  acceptNotif(notifData) {
    //console.log("Inside acceptNotif function || notifData=", notifData);
      this.acceptNotifSubscription$=this.dataService.acceptRequest(notifData)
        .subscribe(
        res => {
          //console.log("Final this.myProfile.notifications || this.dataService.getMyProfile()=",this.dataService.getMyProfile());
          //console.log("Res from server || res=", res.url);
          if(res.url!=="http://localhost:4200/api/users/acceptContactRequest"){
            this.router.navigate(['dashboard/settings'])
          }
        },
        err => { return err },
        () => console.log('Done')
        )
  }
  ngOnDestroy() {
    if(this.denyNotifSubscription$)this.denyNotifSubscription$.unsubscribe();
    if(this.acceptNotifSubscription$)this.acceptNotifSubscription$.unsubscribe();
  }
}
