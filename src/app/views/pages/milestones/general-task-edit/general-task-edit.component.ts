import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-general-task-edit',
  templateUrl: './general-task-edit.component.html',
  styleUrls: ['./general-task-edit.component.css']
})
export class GeneralTaskEditComponent implements OnInit {

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
