import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ApiDataService } from './users/api-data.service';
import { UtilityService } from './users/utility.service';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';


@Injectable({
    providedIn: 'root'
})
export class AccdetailsService {

    constructor(private router: Router, public dataService: ApiDataService, public utility: UtilityService, public utility2: UtilityServiceV2) { }
    isIntervalRunning = false;
    isIntervalStaretd = false;
    isAlertShown = false;

    refreshToken(service) {
        if (!service.isIntervalRunning) return
        let user = sessionStorage.getItem("usr");
        let decrypt = JSON.parse(CryptoJS.AES.decrypt(user, environment.decryptKey).toString(CryptoJS.enc.Utf8));

        //checks if the expiry time has crossed --> logout immidiately+ close swal
        if (decrypt.exp < Date.now()) {
            sessionStorage.setItem("loggedOutUser", sessionStorage.getItem("usr"))
            sessionStorage.removeItem("usr");
            service.router.navigate(['/auth/login']);
            Swal.close();
            this.isAlertShown = false;
            return false;
        }

        //checks if the expiry time is about to be completed in next 15 min --> asks for refresh prompt
        if (decrypt.exp - Date.now() <= 15 * 60 * 1000) {
            if (service.utility2.processingBackgroundData.length != 0 && service.utility2.processingBackgroundData.some(el => (!el.isProcessed || el.isProcessed == false))) {
                //send body & add body.isRefreshToken --> backend will refresh token --> ***in auth intercepetor usr is updated
                decrypt.isRefreshToken = true;
                service.dataService.postData(service.utility.apiData.userAccounts.ApiUrl, JSON.stringify(decrypt), true)
                    .subscribe(Response => {
                        console.log(Response)
                    }, error => {
                        console.log(error)
                    });
                return decrypt;
            } else {
                if (this.isAlertShown) return;
                this.isAlertShown = true
                Swal.fire({
                    title: 'Your session is about to expire!',
                    html: 'You have been inactive for the last 45 minutes. Due to HIPAA security reasons, you will be automatically logged out in the next 15 minutes. Any unsaved progress will be <b>lost.</b> To continue with your session and avoid logging out please select “Yes, Continue."',
                    showDenyButton: true,
                    confirmButtonText: 'Yes, Continue',
                    denyButtonText: 'No, Log Off',
                }).then((result) => {
                    if (result.isConfirmed) {
                        //send body & add body.isRefreshToken --> backend will refresh token --> ***in auth intercepetor usr is updated
                        decrypt.isRefreshToken = true;
                        service.dataService.postData(service.utility.apiData.userAccounts.ApiUrl, JSON.stringify(decrypt), true)
                            .subscribe(Response => {
                                console.log(Response)
                            }, error => {
                                console.log(error)
                            });
                        this.isAlertShown = false;
                        return decrypt;
                    } else if (result.isDenied) {
                        sessionStorage.setItem("loggedOutUser", sessionStorage.getItem("usr"))
                        sessionStorage.removeItem("usr");
                        service.router.navigate(['/auth/login']);
                        Swal.close();
                        this.isAlertShown = false;
                        return false;
                    }
                })
            }
        }
    }

    getUserDetails() {
        try {
            let user = sessionStorage.getItem("usr");
            if (user) {
                let decrypt = JSON.parse(CryptoJS.AES.decrypt(user, environment.decryptKey).toString(CryptoJS.enc.Utf8));
                if (decrypt.exp >= Date.now()) {
                    //we set a timer for refreshing token every 1 min
                    if (!this.isIntervalRunning) {
                        this.isIntervalRunning = true;
                        if (!this.isIntervalStaretd) {
                            this.isIntervalStaretd = true;
                            setInterval(this.refreshToken, 1 * 60 * 1000, this);
                        }
                    }
                    return decrypt;
                } else {
                    //if the session is not renewed by swal,then automatically the session logsout --> this happens after
                    sessionStorage.setItem("loggedOutUser", sessionStorage.getItem("usr"))
                    sessionStorage.removeItem("usr");
                    this.router.navigate(['/auth/login']);
                    Swal.close();
                    return false;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}
