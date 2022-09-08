//@ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AccdetailsService } from './accdetails.service';
import { ApiDataService } from './users/api-data.service';
import { UtilityService } from './users/utility.service';
@Injectable({
  providedIn: 'root'
})
export class PermissionGuardService implements CanActivate {
  products = [];
  permissions = [];
  hasMail = false;
  hasMeet = false;
  isAdmin = false;
  isPackageSelecetd = false;
  isPristine = true;
  hasProducts = true;
  forceReload = false;

  constructor(private router: Router, private utility: UtilityService, private dataService: ApiDataService, private http: HttpClient, private usr: AccdetailsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(this.products);
    if (this.products.length == 0 || this.forceReload) {
      let load = this.reloadPermission();
      if (load) {
        return new Observable<boolean>(() => {
          this.dataService.getallData(load, true).subscribe(Response => {
            if (Response) Response = JSON.parse(Response.toString());
            this.isPristine = false;
            this.products = Response['products'];
            this.permissions = Response['permissions'];
            this.checkPackages();
            this.router.navigate([state.url]);
          }, () => {
            this.router.navigate(['/auth/login']);
            return false;
          });
        });
      } else {
        return this.activate(state);
      }
    } else {
      return this.activate(state);
    }
  }

  permissionsArray = ['patients', 'cases', 'mail', 'meet', 'contacts'];
  plannerPermissionArray = ['colleagues', 'referral', 'work-orders', 'invitations', 'milestones', 'files'];

  activate(state): boolean {
    if (this.isAdmin || state.url.includes("dashboard")) return true;
    this.permissionsArray.forEach(permission => {
      if (state.url.includes(permission) && this.permissions.includes(tab)) return true
    });
    if (this.products.includes("Planner")) {
      this.plannerPermissionArray.forEach(permission => {
        if (state.url.includes(permission) && this.permissions.includes(tab)) return true
      });
    }
    return false;
  }

  hasPermission(module) {
    if (this.isAdmin || state.url.includes("dashboard")) return true;
    if (this.plannerPermissionArray.includes(module)) {
      if (this.products.includes("Planner") && this.permissions.includes(module)) return true;
    } else {
      if (this.permissions.includes(module)) return true
    }
    return false;
  }

  checkPackages() {
    if (this.products.length == 0) {
      if (!this.isPackageSelecetd && !this.usr.getUserDetails().Subuser) {
        this.isPackageSelecetd = false;
        this.router.navigate(['/accounts/packages']);
      }
      this.hasProducts = false;
    }
  }

  reloadPermission(): string {
    let user = this.usr.getUserDetails();
    if (!user) return null;
    if (this.isPristine) {
      let url = this.utility.apiData.usage.ApiUrl + `?email=${user.emailAddress}&type=permission`
      this.isAdmin = true;
      if (user.Subuser) {
        url = this.utility.apiData.usage.ApiUrl + `?email=${user.emailAddress}&issub=true&subuserid=${user.Subuser.subUserID}&type=permission`;
        this.isAdmin = false;
      }
      return url;
    } else {
      this.checkPackages();
      return null;
    }
  }
}
