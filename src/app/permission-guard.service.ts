import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AccdetailsService } from './views/pages/accdetails.service';
import { ApiDataService } from './views/pages/users/api-data.service';
import { UtilityService } from './views/pages/users/utility.service';

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
            this.router.navigate(['/login']);
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

  activate(state): boolean {
    if (state.url.includes("dashboard")) {
      return true;
    }
    if (state.url.includes("mail") && !state.url.includes("packages") && !state.url.includes("talk")) {
      if (this.hasPermission('Inbox')) return true; else this.router.navigate(['/accounts/subaccount']);
    }
    if (state.url.includes("compose")) {
      if (this.hasPermission('Compose')) return true; else return false;
    }
    if (state.url.includes("inbox")) {
      if (this.hasPermission('Inbox')) return true; else return false;
    }
    if (state.url.includes("sent")) {
      if (this.hasPermission('Sent')) return true; else return false;
    }
    if (state.url.includes("contacts")) {
      if (this.hasPermission('Contacts')) return true; else return false;
    }
    if (state.url.includes("patients")) {
      if (this.hasPermission('Patients')) return true; else return false;
    }
    if (state.url.includes("talk")) {
      if (this.hasPermission('Meet', true)) return true; else return false;
    }
    return true;
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

  hasPermission(tab, isMeet = false) {
    if (isMeet) {
      if (this.products.includes('Meet')) return true;
      else return false;
    } else {
      if (this.isAdmin && this.products.includes('Mail')) return true;
      if (this.permissions.includes(tab)) return true;
      return false;
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
