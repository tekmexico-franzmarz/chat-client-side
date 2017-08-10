import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Subject } from 'rxjs/Subject';
import IO from 'socket.io-client';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class BroadcastService {
  private socket: IO.SOCKET;
  private subscribers: {};
  private eventManager: Subject<any>;
  private eventObservable: Observable<any>;

  constructor(private chatService: ChatService) {
    this.subscribers = {};

    this.eventManager = new Subject<string>();
    this.eventObservable = Observable.from(this.eventManager);
    this.eventObservable.subscribe(
      ({ name, args }) => {
        //console.log("====> Broadcast Service: this.subscribers[name]= ", this.subscribers[name])
        if (this.subscribers[name]) {
          for (let callback of this.subscribers[name]) {
            callback(...args)
          }
        }
      });

  }

  on(name, callback) {
    //console.log("====> Broadcast Service: ON function ||name= ", name)
    if (!this.subscribers[name]) {
      this.subscribers[name] = [];
    }
    this.subscribers[name].push(callback)
  }

  broadcast(name, ...args) {
    //console.log("====> Broadcast Service: broadcast.name= ", name, " || broadcast.args", args)
    this.eventManager.next({
      name,
      args
    })
  }

  connectToServer(userID) {
    this.socket = IO('http://localhost:3000', {
      query: {
        userId: userID
      }
    });
    this.socket.on("connect", () => {

      this.socket.on("msgFromServer", (data) => {
        console.log("++++++ Message from server: ", data)
      })

      this.socket.on("userLoggedInAlert", (data) => {
        console.log("++++++ User Logged In Alert: ", data)
      })

      this.socket.on("userLoggedOutAlert", (data) => {
        console.log("++++++ User Logged Out Alert: ", data)
      })

      this.socket.on("room-verification", (data) => {
        console.log("++++++ You are now in room: ", data)
      })

      this.socket.on("user-message-incoming", (data) => {
        console.log("++++++ Received a Message", data);
        this.broadcast("add-message-inDOM",data);
      })
    })
  }

  confirmMsgToServer(msg,contactInfo,chatroom){
    this.socket.emit('msg-complete',{msg,contactInfo,chatroom})
  }
  connectToRoom(chatroom){
    this.socket.emit('connectTo-room',chatroom)
  }
  disconnectOfRoom(chatroom){
    this.socket.emit('disconnectOf-room',chatroom)
  }
}
