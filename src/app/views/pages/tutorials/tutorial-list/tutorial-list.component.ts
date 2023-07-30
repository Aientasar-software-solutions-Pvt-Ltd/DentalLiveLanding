import { Component, OnInit } from '@angular/core';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';

@Component({
  selector: 'app-tutorial-list',
  templateUrl: './tutorial-list.component.html',
  styleUrls: ['./tutorial-list.component.css']
})
export class TutorialListComponent implements OnInit {

  constructor(public utility2: UtilityServiceV2) { }
  namesArray = []

  ngOnInit(): void {
    this.namesArray = Object.keys(this.utility2.tutorialData)
  }

}
