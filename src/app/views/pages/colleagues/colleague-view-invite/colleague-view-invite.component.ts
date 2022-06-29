import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-colleague-view-invite',
  templateUrl: './colleague-view-invite.component.html',
  styleUrls: ['./colleague-view-invite.component.css']
})
export class ColleagueViewInviteComponent implements OnInit {

  constructor(private location: Location) { }

  back(): void {
    this.location.back()
  }
  
  ngOnInit(): void {
  }

}
