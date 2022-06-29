import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-work-order-edit',
  templateUrl: './work-order-edit.component.html',
  styleUrls: ['./work-order-edit.component.css']
})
export class WorkOrderEditComponent implements OnInit {

  constructor(private location: Location) { }
  
  back(): void {
    this.location.back()
  }
  
  ngOnInit(): void {
  }

}
