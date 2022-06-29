import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-milestone-edit',
  templateUrl: './milestone-edit.component.html',
  styleUrls: ['./milestone-edit.component.css']
})
export class MilestoneEditComponent implements OnInit {

  constructor(private location: Location) { }
  
	back(): void {
		this.location.back()
	}
  ngOnInit(): void {
  }

}
