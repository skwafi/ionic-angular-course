import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify from 'aws-amplify';
// import Amplify, {Auth} from 'aws-amplify';
import amplify from './aws-exports';

Amplify.configure(amplify);


// const myoauth = {
//   // Domain name
//   domain : 'skwafi.auth.eu-west-1.amazoncognito.com',
//   // Authorized scopes
//   scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
//   // Callback URL
//   redirectSignIn : 'https://localhost:4200',
//   // Sign out URL
//   redirectSignOut : 'https://localhost:4200',
//   // 'code' for Authorization code grant,
//   // 'token' for Implicit grant
//   responseType: 'code',
//   // optional, for Cognito hosted ui specified options
//   options: {
//     // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
//     AdvancedSecurityDataCollectionFlag : false
//   }
// };

// Auth.configure({
//   oauth: myoauth
// });



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
