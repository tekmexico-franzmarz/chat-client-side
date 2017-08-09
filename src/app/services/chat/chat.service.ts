import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { MyProfileDataInterface } from '../../interfaces/users';
import { Observable } from "rxjs/Observable";
import * as rx from "rxjs";
import { ConversationInterface } from '../../interfaces/conversations';


@Injectable()
export class ChatService {

  constructor(private http: Http) { }

  createConversation(convConfig): Observable<any> {
    //console.log("Info to send to createConversation endpoint || convConfig=", convConfig);
    return this.http
      .post("/api/chat/createConversation", convConfig)
  }

  updateGroupParticipants(newContacts,conversationId){
    let obj={};
    obj['newContacts']=newContacts;
    obj['conversationId']=conversationId;
    console.log("OBJ=",obj);
    return this.http
      .post("/api/chat/updateGroupParticipants", obj)
  }

  findConversation(myId: string, contactId: string): Observable<any> {
    return this.http
      .post("/api/chat/findConversation", { "myId": myId, "contactId": contactId })
  }

  fetchConversation(conversationId) {
    //console.log("Looking for Conversation with ID=", conversationId);
    let headers = new Headers();
    headers.append('Conversation', conversationId)
    let requestOptions = new RequestOptions({ headers: headers });
    return this.http.get("/api/chat/fetchConversation", requestOptions)
  }

  sendMessage(message) {
    //console.log("Inside send Message")
    return this.http
      .post("/api/chat/sendMessage", message)
      .map((response: Response) => { console.log("Response from server=> ", response); return response });
  }
}
