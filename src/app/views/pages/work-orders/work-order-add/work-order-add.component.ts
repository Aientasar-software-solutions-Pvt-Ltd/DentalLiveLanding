import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-work-order-add',
  templateUrl: './work-order-add.component.html',
  styleUrls: ['./work-order-add.component.css']
})
export class WorkOrderAddComponent implements OnInit {

  constructor(private location: Location) { }
  
  back(): void {
    this.location.back()
  }
  
  ngOnInit(): void {
  }

}
