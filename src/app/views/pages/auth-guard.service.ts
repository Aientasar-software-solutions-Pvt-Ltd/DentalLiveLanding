//@ts-nocheck
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccdetailsService } from './accdetails.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private usr: AccdetailsService, public router: Router,) { }
  async canActivate() {
    if (!this.usr.getUserDetails())
      this.router.navigate(['/login']);
    else
      return true;
  }
}
