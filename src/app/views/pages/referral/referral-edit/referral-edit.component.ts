import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-referral-edit',
  templateUrl: './referral-edit.component.html',
  styleUrls: ['./referral-edit.component.css']
})
export class ReferralEditComponent implements OnInit {

	defaultBindingsList = [
        { value: 1, label: 'Jhone Duo' },
        { value: 2, label: 'Danel Gray' },
        { value: 3, label: 'Pavilnys' }
    ];

    selectedReferred: any;
	
  constructor(private location: Location) { }
  
  back(): void {
    this.location.back()
  }
  ngOnInit(): void {
	this.selectedReferred = this.defaultBindingsList[0];
  }

}
