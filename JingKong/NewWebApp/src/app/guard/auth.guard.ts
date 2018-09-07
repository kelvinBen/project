import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,CanActivateChild } from '@angular/router';
import {LocalStorageService,LocalStorage} from 'ngx-webstorage';
import { ApiService} from '../service/api.service';

@Injectable()

export class AuthGuard implements CanActivate {
    @LocalStorage('CurrentUser') curUser;

    constructor(private router: Router,private storage:LocalStorageService,private apiService:ApiService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        if (this.curUser) {
            // logged in so return true
            return true;
        } else {
            this.apiService.redirectUrl = url
			// not logged in so redirect to login page with the return url
			// this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
			return true;
		}
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
      }
}