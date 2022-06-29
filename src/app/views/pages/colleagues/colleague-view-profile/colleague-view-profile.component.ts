import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-colleague-view-profile',
  templateUrl: './colleague-view-profile.component.html',
  styleUrls: ['./colleague-view-profile.component.css']
})
export class ColleagueViewProfileComponent implements OnInit {

  constructor(private location: Location) { }
  
  back(): void {
    this.location.back()
  }
  
  ngOnInit(): void {
  }

}
