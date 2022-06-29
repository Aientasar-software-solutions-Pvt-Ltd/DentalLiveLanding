import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

	constructor() {
		document.body.style.backgroundColor = "#F7F9FB";
	}

	ngOnInit(): void {}
	
	ngOnDestroy(){
		document.body.style.backgroundColor="";
	}
	
}
