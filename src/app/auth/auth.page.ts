import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  // isLoading = false;
  // isLogin = true;
  // private userId: string;

  constructor(
    private router: Router,
    public amplifyService: AmplifyService,
    private authService: AuthService
    ) {
      this.amplifyService = amplifyService;
      this.amplifyService.authStateChange$
        .subscribe(authState => {
          if (authState.state === 'signedIn') {
            this.router.navigate(['/places/tabs/discover']);
            Auth.currentAuthenticatedUser()
              .then(user => {
            //     this.authService.cognitoUser = user;
            //     this.authService.userEmail = user.attributes.email;
                this.authService.userId = user.attributes.sub;
                this.authService.userName = user.username;
                console.log(this.authService.userId);
                console.log(this.authService.userName);
              });
           }
          });
      }
  ngOnInit() {
  }

}
