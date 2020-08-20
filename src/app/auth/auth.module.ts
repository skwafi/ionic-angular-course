import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AmplifyAngularModule, AmplifyIonicModule } from 'aws-amplify-angular';


import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AmplifyAngularModule,
    AmplifyIonicModule,
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
