import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
	returnUrl: any;
	show: boolean = false;

	isVisible: any;
  
	constructor(private router: Router, private route: ActivatedRoute) {
		this.isVisible = 0;
		document.body.style.backgroundColor = "#F7F9FB"; 
	}
	// click event function toggle
	password() {
		this.show = !this.show;
	}

	ngOnInit(): void {
		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';		
	}
	
	onLoggedin(e:any) {
		e.preventDefault();
		localStorage.setItem('isLoggedin', 'true');
		if (localStorage.getItem('isLoggedin')) {
			this.router.navigate([this.returnUrl]);
		}
	}
	ngOnDestroy(){
		document.body.style.backgroundColor="";
	}
	
}
