import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-case-add-task-add',
  templateUrl: './case-add-task-add.component.html',
  styleUrls: ['./case-add-task-add.component.css']
})
export class CaseAddTaskAddComponent implements OnInit {

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
