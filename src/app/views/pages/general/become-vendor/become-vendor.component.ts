import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-become-vendor',
  templateUrl: './become-vendor.component.html',
  styleUrls: ['./become-vendor.component.css']
})
export class BecomeVendorComponent implements OnInit {
	currentYear: number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
  }

}
