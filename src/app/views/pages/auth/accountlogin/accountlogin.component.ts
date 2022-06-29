//@ts-nocheck
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccountService } from '../../account.service';
@Component({
  selector: 'app-accountlogin',
  templateUrl: './accountlogin.component.html',
  styleUrls: ['./accountlogin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountloginComponent implements OnInit {
  sending: boolean;

  constructor(private authServiceSocial: SocialAuthService, private accService: AccountService, private dataService: ApiDataService, private utility: UtilityService,) { }

  ngOnInit() {
    sessionStorage.removeItem("usr");
    this.sending = false;
  };

  onSubmit(form: NgForm, issubuser) {

    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    this.sending = true;
    const json: JSON = form.value;
    json['isLogin'] = true;
    if (issubuser) {
      this.dataService.postData(this.utility.apiData.subUserAccounts.ApiUrl, JSON.stringify(json), true)
        .subscribe(Response => {
          if (Response) Response = JSON.parse(Response.toString());
          this.sending = false;
          if (!Response) {
            swal.fire("Unable to signup,please try again");
            return;
          }
          this.accService.login();
        }, error => {
          this.sending = false;
          if (error.status === 402)
            swal.fire('Package Expired,please renew your package');
          if (error.status === 404)
            swal.fire('E-Mail ID does not exists,please signup to continue');
          else if (error.status === 403)
            swal.fire('Account Disabled,contact Dental-Live');
          else if (error.status === 400)
            swal.fire('Wrong Password,please try again');
          else if (error.status === 401)
            swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
          else if (error.status === 428)
            swal.fire('Invalid Owner Account');
          else
            swal.fire('Unable to login, please try again');
        });
    } else {
      this.dataService.postData(this.utility.apiData.userAccounts.ApiUrl, JSON.stringify(json), true)
        .subscribe(Response => {
          if (Response) Response = JSON.parse(Response.toString());
          this.sending = false;
          if (!Response) {
            swal.fire("Unable to signup,please try again");
            return;
          }
          this.accService.login();
        }, error => {
          this.sending = false;
          if (error.status === 404)
            swal.fire('E-Mail ID does not exists,please signup to continue');
          else if (error.status === 403)
            swal.fire('Account Disabled,contact Dental-Live');
          else if (error.status === 400)
            swal.fire('Wrong Password,please try again');
          else if (error.status === 401)
            swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
          else if (error.status === 428)
            swal.fire(error.error);
          else
            swal.fire('Unable to login, please try again');
        });
    }
  };

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

