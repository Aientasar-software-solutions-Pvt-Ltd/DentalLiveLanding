//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { AccdetailsService } from '../../accdetails.service';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.css'],
})
export class AccountDashboardComponent implements OnInit {
  user = this.usr.getUserDetails();
  constructor(private usr: AccdetailsService) { }
  ngOnInit() {

  }

}
