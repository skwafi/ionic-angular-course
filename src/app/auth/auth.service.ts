import { Injectable } from '@angular/core';
import {  AmplifyService } from 'aws-amplify-angular';
// import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private myUserId: string;
  private myUserName: string;


  constructor(private amplifyService: AmplifyService) {
    // this.bypassUser = new User('5ba4569a-dda8-4157-b1e1-d5986b61f012', 'test@test.com', 'olivier');
    }

    get userId() {
      return this.myUserId;
    }
    set userId(userId: string) {
     this.myUserId = userId;
    }
    get userName() {
      return this.myUserName;
    }

    set userName(userName: string) {
      this.myUserName = userName;
    }
}
