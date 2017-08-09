export interface MyProfileDataInterface {
  _id: string;
  email: string;
  fullName: string;
  username: string;
  password: string;
  locale: string;
  status: string;
  conversations: Array<any>;
  contacts: Array<any>;
  notifications: [{_id:string, typeNotif: string, from: string, content: string, date: any }];
  groups: Array<any>;
  token:string;
  createdAt: any;
  updatedAt: any;
}

export interface NewUserInterface {
  fullName: string;
  email: string;
  username: string;
  password: string;
  locale: string;
  status: string;
  conversations: Array<any>;
  contacts: Array<any>;
  notifications: [{ typeNotif: string, from: string, content: string, date: any }];
  groups: Array<any>;
  token:string;
  createdAt?: number;
  updatedAt: number;
}
