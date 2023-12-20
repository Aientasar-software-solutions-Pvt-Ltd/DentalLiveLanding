import { AccdetailsService } from 'src/app/views/pages/accdetails.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import sweetAlert from 'sweetalert';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccountService } from '../../account.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
// import * as date from "date-and-time";

@Component({
    selector: 'app-accountlogin',
    templateUrl: './accountlogin.component.html',
    styleUrls: ['./accountlogin.component.css']
})
export class AccountloginComponent implements OnInit {
    sending: boolean;

    constructor(private authServiceSocial: SocialAuthService, private accService: AccountService, private accdetails: AccdetailsService, private dataService: ApiDataService, private utility: UtilityService,) { }

    ngOnInit() {
        this.logoutUser();
        this.accdetails.isIntervalRunning = false;
        this.sending = false;
    };

    logoutUser() {
        console.log("enter")
        //as usr was existing previously,and as this was removed at multiple places,keeping the usr intact a new session item loggedOutUser was introdicued,whenerv usr was removed,beofre that this new variable was assigned temp value
        let user = sessionStorage.getItem("usr") ? sessionStorage.getItem("usr") : sessionStorage.removeItem("loggedOutUser");
        sessionStorage.removeItem("loggedOutUser");
        sessionStorage.removeItem("usr");
        if (user) {
            let decrypt = JSON.parse(CryptoJS.AES.decrypt(user, environment.decryptKey).toString(CryptoJS.enc.Utf8));
            console.log(decrypt)
            if (decrypt.emailAddress) {
                let obj = {
                    'emailAddress': decrypt.emailAddress,
                    "loggedOut": new Date().getTime(),
                    "isLogout": true
                }
                this.dataService.putData(this.utility.apiData.userAccounts.ApiUrl, JSON.stringify(obj)).subscribe((Response) => console.log(Response), (error) => console.log(error));
            }
        }
    }

    onSubmit(form: NgForm, issubuser) {
        if (form.invalid) {
            form.form.markAllAsTouched();
            return;
        }
        this.sending = true;
        const json: JSON = form.value;
        json['isLogin'] = true;
        if (issubuser) {
            //alert(this.utility.apiData.subUserAccounts.ApiUrl);
            this.dataService.postData(this.utility.apiData.subUserAccounts.ApiUrl, JSON.stringify(json), true)
                .subscribe(Response => {
                    if (Response) Response = JSON.parse(Response.toString());
                    this.sending = false;
                    if (!Response) {
                        sweetAlert("Unable to signup, please try again");
                        return;
                    }
                    this.accService.login();
                }, error => {
                    this.sending = false;
                    if (error.status === 402)
                        sweetAlert('Package Expired,please renew your package');
                    if (error.status === 404)
                        sweetAlert('E-Mail ID does not exists,please signup to continue');
                    else if (error.status === 403)
                        sweetAlert('Account Disabled,contact Dental-Live');
                    else if (error.status === 400)
                        sweetAlert('Wrong Password,please try again');
                    else if (error.status === 401)
                        sweetAlert('Account Not Verified . Please Activate The Account From The Email Sent To The Email Address');
                    else if (error.status === 428)
                        sweetAlert('Invalid Owner Account');
                    else
                        sweetAlert('Unable To Login, Please Try Again');
                });
        } else {
            //alert(this.utility.apiData.userAccounts.ApiUrl);
            this.dataService.postData(this.utility.apiData.userAccounts.ApiUrl, JSON.stringify(json), true)
                .subscribe(Response => {
                    if (Response) Response = JSON.parse(Response.toString());
                    this.sending = false;
                    if (!Response) {
                        sweetAlert("Unable to signup,please try again");
                        return;
                    }
                    this.accService.login();
                }, error => {
                    this.sending = false;
                    if (error.status === 404)
                        sweetAlert('E-Mail ID does not exists,please signup to continue');
                    else if (error.status === 403)
                        sweetAlert('Account Disabled,contact Dental-Live');
                    else if (error.status === 400)
                        sweetAlert('Wrong Password,please try again');
                    else if (error.status === 401)
                        sweetAlert('Account Not Verified . Please Activate The Account From The Email Sent To The Email Address');
                    else if (error.status === 428)
                        sweetAlert(error.error);
                    else
                        sweetAlert('Unable To Login, Please Try Again');
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

    // signInWithFB(): void {
    //   const fbLoginOptions = {
    //     scope: 'email,public_profile',
    //     return_scopes: true,
    //     enable_profile_selector: true
    //   }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
    //   this.authServiceSocial.signIn(FacebookLoginProvider.PROVIDER_ID, fbLoginOptions).then((user) => {
    //     this.accService.SocailLogin(user);
    //   });
    // }
}

