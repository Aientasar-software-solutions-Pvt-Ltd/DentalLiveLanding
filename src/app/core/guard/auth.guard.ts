import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AccdetailsService } from 'src/app/views/pages/accdetails.service';
import { PermissionGuardService } from 'src/app/views/pages/permission-guard.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, OnInit {

  constructor(private usr: AccdetailsService, private router: Router, private permGuard: PermissionGuardService) { }
  ngOnInit(): void {
    this.permGuard.forceReload = true;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usr.getUserDetails()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }


}
