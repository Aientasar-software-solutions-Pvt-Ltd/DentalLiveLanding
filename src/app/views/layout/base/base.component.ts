import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccdetailsService } from '../../pages/accdetails.service';

@Component({
	selector: 'app-base',
	templateUrl: './base.component.html',
	styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

	constructor(private router: Router, private usr: AccdetailsService) {
		document.body.style.backgroundColor = "#F7F9FB";
		window.addEventListener('focus', event => {
			if (!this.usr.getUserDetails())
				this.router.navigate(['/auth/login']);
		});
	}

	ngOnInit(): void { }

}
