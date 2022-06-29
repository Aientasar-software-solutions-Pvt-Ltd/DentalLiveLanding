import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-general-task-add',
  templateUrl: './general-task-add.component.html',
  styleUrls: ['./general-task-add.component.css']
})
export class GeneralTaskAddComponent implements OnInit {

	defaultBindingsList = [
        { value: 1, label: 'Jhone Duo' },
        { value: 2, label: 'Danel Gray' },
        { value: 3, label: 'Pavilnys' }
    ];
	selectedMember: any;
  constructor(private location: Location) { }

  back(): void {
    this.location.back()
  }
  
  ngOnInit(): void {
	this.selectedMember = this.defaultBindingsList[0];
  }

}
