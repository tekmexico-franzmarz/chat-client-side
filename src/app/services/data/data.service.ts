import { Injectable } from "@angular/core";
import {
  Http,
  Headers,
  Response,
  URLSearchParams,
  RequestOptions
} from "@angular/http";
import { MyProfileDataInterface } from "../../interfaces/users";

import { BroadcastService } from "../broadcast/broadcast.service";

import { Observable } from "rxjs/Observable";
import * as rx from "rxjs";

@Injectable()
export class DataService {
  private myProfile: MyProfileDataInterface;
  public myProfileWatcher: Observable<any>;
  public messagesForUser: Array<string> = [];

  constructor(private http: Http, private broadcastService: BroadcastService) {}

  resolve(): Observable<any> {
    let myToken: string = JSON.parse(sessionStorage.getItem("userToken"));
    let headers = new Headers();
    headers.append("Authorization", "JWT " + myToken);
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let requestOptions = new RequestOptions({ headers: headers });
    return this.http
      .get("/api/users/myProfile", requestOptions)
      .map((res: Response) => res.json());
  }

  addContact(data): Observable<any> {
    return this.http.post("/api/users/requestContact", data);
  }

  denyRequest(data, myId): Observable<any> {
    let myTempProfile = this.getMyProfile();
    data.myId = myId;
    myTempProfile.notifications.forEach((notif, idx, object) => {
      if (notif._id === data._id) {
        object.splice(idx, 1);
      }
    });
    this.shallowProfileUpdate(myTempProfile);
    return this.http.post("/api/users/denyContactRequest", data);
  }

  acceptRequest(data): Observable<any> {
    let myTempProfile = this.getMyProfile();
    data.myId = myTempProfile._id;
    myTempProfile.notifications.forEach((notif, idx, object) => {
      if (notif._id === data._id) {
        object.splice(idx, 1);
      }
    });
    if (data.typeNotif == "new-contact") {
      myTempProfile.contacts.push({ _id: data.senderId, username: data.from });
      this.shallowProfileUpdate(myTempProfile);
      return this.http.post("/api/users/acceptContactRequest", data);
    } else if (data.typeNotif == "user-config") {
      return this.http.post("/api/users/acceptNotification", data);
    }
  }

  getMyProfile(): MyProfileDataInterface {
    return this.myProfile;
  }

  shallowProfileUpdate(profile: MyProfileDataInterface): void {
    this.myProfile = profile;
    console.log(
      ">>>>>>>>>>>>>>>>> UPDATED CENTRAL myProfile OBJECT <<<<<<<<<<<<<<<<<<<",
      this.myProfile
    );
  }

  updateMyProfile(data) {
    return this.http.post("/api/users/updateMyProfile", data);
  }

  clearMyProfile(): void {
    this.myProfile = null;
  }
}
