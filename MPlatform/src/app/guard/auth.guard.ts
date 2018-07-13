import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,CanActivateChild } from '@angular/router';
import {LocalStorageService,LocalStorage} from 'ngx-webstorage';
import { AuthenticationService} from '../service/authentication.service';

@Injectable()

export class AuthGuard implements CanActivate {
    @LocalStorage('CurrentUser') curUser;

    constructor(private router: Router,private storage:LocalStorageService,private authService:AuthenticationService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        if (this.curUser) {
            // this.router.navigate(['/mcc/mymcc/myplatform'],{ queryParams: { returnUrl: state.url }})
            // logged in so return true
            return true;
        } else {
            this.authService.redirectUrl = url
			// not logged in so redirect to login page with the return url
			this.router.navigate(['/mcc/login'], { queryParams: { returnUrl: state.url }});
			return false;
		}
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
      }
}