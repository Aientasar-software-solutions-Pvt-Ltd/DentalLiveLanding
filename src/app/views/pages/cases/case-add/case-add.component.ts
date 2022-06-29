import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-add',
  templateUrl: './case-add.component.html',
  styleUrls: ['./case-add.component.css']
})
export class CaseAddComponent implements OnInit {
	id:any = "addNonMembers";
	tabContent(ids:any){
		this.id = ids;
	}
	
	btnState:boolean=true;
	
	actionMethod(event: MouseEvent){
		(event.target as HTMLButtonElement).disabled = true;
		if((event.target as HTMLButtonElement).disabled = true ){
		  this.btnState = false;
		}
		else{
		  this.btnState = true;
		}
	}
	
	constructor() { }
 
	ngOnInit(): void {
	}
}
