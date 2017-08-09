export interface ConversationInterface {
  _id: string;
  conversationType: string;
  conversationName: string;
  owner: string;
  participants: [{_id:string, email: string, fullName: string, username: string}];
  createdAt: number;
}
