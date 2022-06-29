//@ts-nocheck
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccdetailsService {

  constructor(private router: Router) { }
  getUserDetails(redirect = true) {
    try {
      let user = sessionStorage.getItem("usr");
      if (user) {
        let decrypt = JSON.parse(CryptoJS.AES.decrypt(user, environment.decryptKey).toString(CryptoJS.enc.Utf8));
        if (decrypt.exp >= Date.now()) {
          return decrypt;
        }
      }
    } catch (e) { }
    sessionStorage.removeItem("usr");
    if (redirect)
      this.router.navigate(['/login']);
    return false;
  }
}
