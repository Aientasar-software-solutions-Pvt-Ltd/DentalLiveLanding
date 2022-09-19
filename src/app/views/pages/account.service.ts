//@ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import swal from 'sweetalert';
import { UtilityService } from './users/utility.service';
import { ApiDataService } from './users/api-data.service';
import { PermissionGuardService } from './permission-guard.service';
import { AccdetailsService } from './accdetails.service';
import { Router } from '@angular/router';
export interface account {
  pk: string,
  sk: string,
  accountfirstName: string,
  accountlastName: string,
  emailAddress: string,
  imageSrc: string,
  phoneNumber: string,
  dob: string
}
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //singleton package object shared across all the components
  sharedAccountData: BehaviorSubject<Array<account>> = new BehaviorSubject([]);
  putInvoice: string;
  getInvoice: string;
  constructor(private http: HttpClient, private router: Router, private permAuth: PermissionGuardService, private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService) {
    this.putInvoice = "https://7ktpuzg775.execute-api.us-west-2.amazonaws.com/default/putInvoice";//*
    this.getInvoice = "https://o4xnrsx427.execute-api.us-west-2.amazonaws.com/default/getInvoice";
  }
  login() {
    let user = this.usr.getUserDetails(false);
	let url = this.utility.apiData.userLogin.ApiUrl;
	url += "?emailAddress="+user.emailAddress;
	this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			//alert(JSON.stringify(3213));
			let treadAllData = JSON.parse(Response.toString());
			//alert(JSON.stringify(treadAllData));
			if((treadAllData[0].lastLoggedIn != undefined) && (treadAllData[0].lastLoggedIn != '') && (treadAllData[0].lastLoggedIn != null))
			{
			sessionStorage.setItem('loginResourceId', treadAllData[0].lastLoggedIn);
			}
			if((treadAllData[0].lastLoggedOut != undefined) && (treadAllData[0].lastLoggedOut != '') && (treadAllData[0].lastLoggedOut != null))
			{
			sessionStorage.setItem('loginResourceId', treadAllData[0].lastLoggedOut);
			}
		}
	}, (error) => {
	  swal("Unable to fetch data, please try again");
	  return false;
	});
	setTimeout(() => {
    const json1: JSON = {};
    json1['dentalId'] = user.dentalId;
    json1['emailAddress'] = user.emailAddress;
    json1['lastLoggedIn'] = Date.now();
    //alert(JSON.stringify(json1));
    this.dataService.postData(this.utility.apiData.userLogin.ApiUrl, JSON.stringify(json1), true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        //alert(JSON.stringify(Response));
       // alert(JSON.stringify(Response.resourceId));
        if (!Response) {
          swal("Unable to save login time,please try again");
          return;
        }
      }, error => {
        this.sending = false;
        if (error.status === 404)
          swal('E-Mail ID does not exists,please signup to continue');
        else if (error.status === 403)
          swal('Account Disabled,contact Dental-Live');
        else if (error.status === 400)
          swal('Wrong Password,please try again');
        else if (error.status === 401)
          swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
        else if (error.status === 428)
          swal(error.error);
        else
          swal('Unable to login, please try again');
      });

    swal("Login initiated...please wait...", {
      buttons: [false, false],
      closeOnClickOutside: false,
    });
    let url = this.utility.apiData.usage.ApiUrl + `?email=${user.emailAddress}&type=permission`
    this.permAuth.isAdmin = true;
    if (user.Subuser) {
      url = this.utility.apiData.usage.ApiUrl + `?email=${user.emailAddress}&issub=true&subuserid=${user.Subuser.subUserID}&type=permission`;
      this.permAuth.isAdmin = false;
    }
    this.dataService.getallData(url, true).subscribe(Response => {
      if (Response) Response = JSON.parse(Response.toString());
      swal.close();
      this.permAuth.isPristine = false;
      this.permAuth.products = Response['products'];
      this.permAuth.permissions = Response['permissions'];
      if (this.permAuth.products.length == 0 && !user.Subuser) this.router.navigate(['/accounts/packages']);
      else this.router.navigate(['dashboard']);
    }, (error) => {
      swal("Unable to login, please try again");
      return false;
    });
	},1000);
  }
  SocailLogin(user) {
    if (!user) return;
    swal("Processing request...please wait...", {
      buttons: [false, false],
      closeOnClickOutside: false,
    });
    let json = {};
    json['accountfirstName'] = user.firstName ? user.firstName : "";
    json['accountlastName'] = user.lastName ? user.lastName : "";
    json['emailAddress'] = user.email ? user.email : "";
    json['isSocialLogin'] = true;
    this.dataService.postData(this.utility.apiData.userAccounts.ApiUrl, JSON.stringify(json), true)
      .subscribe(Response => {
        if (!Response) {
          swal("Unable to login, please try again");
          return;
        }
        if (Response) Response = JSON.parse(Response.toString());
        this.login();
      }, (err) => {
        if (err.status === 403)
          swal('Account Disabled,contact Dental-Live');
        else if (err.status === 428)
          swal(err.error);
        else
          swal("Unable to login, please try again");
      })
  }
  updateAccountData(message: any) {
    this.sharedAccountData.next(message)
  }
  putInvoiceData(data) {
    return this.http.post(this.putInvoice, data);
  }
  getInvoiceData(data) {
    return this.http.post(this.getInvoice, data);
  }
}
