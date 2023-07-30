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
  products = ['Mail', 'Meet', 'Planner'];
  permissions = [];
  hasMail = false;
  hasMeet = false;
  isAdmin = false;
  isPackageSelecetd = false;
  isPristine = true;
  hasProducts = true;
  forceReload = false;

  constructor(private router: Router, private utility: UtilityService, private dataService: ApiDataService, private http: HttpClient, private usr: AccdetailsService) { }

  // when URL is changed
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isPristine || this.products.length == 0 || this.forceReload) {
      return this.refreshPermission().then(() => {
        return this.activate(state);
      }, (err) => {
        this.router.navigate(['/auth/login']);
        return false
      })
    } else {
      return this.activate(state);
    }
  }

  permissionsArray = ['patients', 'cases', 'cases-view', 'mail', 'meet', 'contacts', 'accounts'];
  plannerPermissionArray = ['colleagues', 'referrals', 'workorders', 'caseinvites', 'milestones', 'casefiles'];

  activate(state): boolean {
    // if (this.products.length == 0) return false;
    if (this.isAdmin || state.url.includes("dashboard") || state.url.includes("accounts")) return true;
    console.log(this.permissionsArray, this.plannerPermissionArray)
    for (let permission of this.permissionsArray) {
      if (state.url.includes(permission) && this.permissions.includes(permission)) return true
    };
    if (this.products.includes("Planner")) {
      for (let permission of this.plannerPermissionArray) {
        if (state.url.includes(permission) && this.permissions.includes(permission)) return true
      };
    }
    return false;
  }

  // Check permissiosn for sideBar
  async hasPermission(module) {
    // if (this.products.length == 0) return false;
    if (this.isPristine) await this.refreshPermission();
    if (this.isAdmin) return true;
    if (this.plannerPermissionArray.includes(module)) {
      if (this.products.includes("Planner") && this.permissions.includes(module)) return true;
    } else {
      if (this.permissions.includes(module)) return true
    }
    return false;
  }

  async refreshPermission() {
    this.isPristine = false
    try {
      let user = this.usr.getUserDetails();
      console.log(user);
      let url = this.utility.apiData.usage.ApiUrl + `?email=${user.emailAddress}&type=permission`
      this.isAdmin = true;
      if (user.Subuser) {
        url = this.utility.apiData.usage.ApiUrl + `?email=${user.emailAddress}&issub=true&subuserid=${user.Subuser.subUserID}&type=permission`;
        this.isAdmin = false;
      }
      let Response = await this.dataService.getallData(url, true).toPromise();
      if (Response) Response = JSON.parse(Response.toString());
      this.products = ['Mail', 'Meet', 'Planner']
      this.permissions = Response['permissions'];
    } catch (error) {
      console.log(error)
      this.router.navigate(['/auth/login']);
    }
  }
}
