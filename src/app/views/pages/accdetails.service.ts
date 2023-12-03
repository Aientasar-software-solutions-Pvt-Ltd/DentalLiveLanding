import { HttpClient } from '@angular/common/http';
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

  refreshToken(service) {
    if (!service.isIntervalRunning) return
    let user = sessionStorage.getItem("usr");
    let decrypt = JSON.parse(CryptoJS.AES.decrypt(user, environment.decryptKey).toString(CryptoJS.enc.Utf8));
    //checks if the expiry time is about to be completed in next 15 min --> asks for refresh prompt
    if (decrypt.exp - Date.now() <= 15 * 60 * 1000) {
      if (this.utility2.processingBackgroundData.length != 0 && this.utility2.processingBackgroundData.some(el => (!el.isProcessed || el.isProcessed == false))) {
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
        Swal.fire({
          title: 'Your session is about to be Expired in 15 Minutes,Do you want to continue your session?',
          showDenyButton: true,
          confirmButtonText: 'Yes,Continue',
          denyButtonText: 'No,Logout',
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
            return decrypt;
          } else if (result.isDenied) {
            sessionStorage.removeItem("usr");
            service.router.navigate(['/auth/login']);
            Swal.close();
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
          //we set a timer for refreshing token every 5 min
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
