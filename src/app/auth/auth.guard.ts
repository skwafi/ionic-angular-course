import { Injectable } from '@angular/core';
import { CanLoad, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from 'aws-amplify';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanLoad,  CanActivate {

  constructor(
    private router: Router,
    private authSrv: AuthService
    ) {}
    canLoad(): Promise<boolean>  {
      return new Promise((resolve) => {
        Auth.currentAuthenticatedUser({
          bypassCache: false
        })
        .then((user) => {
          if (user) {
            resolve(true);
          }
        })
        .catch(() => {
            this.router.navigate(['/auth']);
            resolve(false);
        });
      });
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>  {
      return new Promise((resolve) => {
        Auth.currentAuthenticatedUser({
          bypassCache: false
        })
        .then((user) => {
          if (user) {
            resolve(true);
          }
        })
        .catch(() => {
            this.router.navigate(['/auth']);
            resolve(false);
        });
      });
    }
  }
