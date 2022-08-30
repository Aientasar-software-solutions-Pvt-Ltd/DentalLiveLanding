//@ts-nocheck
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { AccountService } from '../../account.service';
import { PermissionGuardService } from '../../permission-guard.service';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { UtilityService } from '../../users/utility.service';


@Component({
  selector: 'app-accountsignup',
  templateUrl: './accountsignup.component.html',
  styleUrls: ['./accountsignup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountsignupComponent implements OnInit {
  sending: boolean;

  constructor(private router: Router, private accService: AccountService, private authServiceSocial: SocialAuthService, private route: ActivatedRoute, private utility: UtilityService, private permAuth: PermissionGuardService, private dataService: ApiDataService, private usr: AccdetailsService) { }

  package = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('package') && params.get('package') != "") {
        this.package = params.get('package');
      }
    });
    sessionStorage.removeItem("usr");
    this.sending = false;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    this.sending = true;
    let json: JSON = form.value;
    json['url'] = this.utility.accountValidateURL;
    this.dataService.postData(this.utility.apiData.userAccounts.ApiUrl, JSON.stringify(json), true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        this.sending = false;
        this.router.navigate(['/dovalidate', json['emailAddress']]);
      }, error => {
        this.sending = false;
        if (error.status == 409)
          swal("E-Mail ID exists already,please login to continue");
        else
          swal("Unable to signup,please try again");
      })
  }

  signInWithGoogle(): void {
    const googleLoginOptions = {
      scope: 'profile email'
    }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions).then((user) => {
      this.accService.SocailLogin(user);
    });
  }

  signInWithFB(): void {
    const fbLoginOptions = {
      scope: 'email,public_profile',
      return_scopes: true,
      enable_profile_selector: true
    }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
    this.authServiceSocial.signIn(FacebookLoginProvider.PROVIDER_ID, fbLoginOptions).then((user) => {
      this.accService.SocailLogin(user);
    });
  }
}


