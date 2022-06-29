import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-general-task-view',
  templateUrl: './general-task-view.component.html',
  styleUrls: ['./general-task-view.component.css']
})
export class GeneralTaskViewComponent implements OnInit {

	defaultBindingsList = [
        { value: 1, label: 'Jhone Duo' },
        { value: 2, label: 'Danel Gray' },
        { value: 3, label: 'Pavilnys' }
    ];
	selectedMember: any ;
	constructor(private location: Location) { }

	back(): void {
		this.location.back()
	}
  
	ngOnInit(): void {
		this.selectedMember = this.defaultBindingsList[0];
	}

}
