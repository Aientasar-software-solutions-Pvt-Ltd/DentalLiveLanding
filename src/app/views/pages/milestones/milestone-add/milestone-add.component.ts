import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-milestone-add',
  templateUrl: './milestone-add.component.html',
  styleUrls: ['./milestone-add.component.css']
})
export class MilestoneAddComponent implements OnInit {

  constructor(private location: Location) { }
  
	back(): void {
		this.location.back()
	}
  ngOnInit(): void {
  }

}
