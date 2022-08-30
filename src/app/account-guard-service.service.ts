import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccdetailsService } from './views/pages/accdetails.service';


@Injectable({
  providedIn: 'root'
})
export class AccountGuardServiceService implements CanActivate {

  constructor(private usr: AccdetailsService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let user = this.usr.getUserDetails();
    if (!user.Subuser && state.url.includes("subaccount"))
      return false;
    else if (user.Subuser && !state.url.includes("subaccount"))
      return false;
    else
      return true;
  }
}
