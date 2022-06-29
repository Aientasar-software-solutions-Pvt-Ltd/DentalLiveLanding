import { Component, OnInit, HostListener } from '@angular/core';
import * as $ from "jquery";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
classFlag = false;
  constructor() { }
@HostListener('window:resize', ['$event'])
  ngOnInit(): void {
	if (window.innerWidth <= 575) {
		this.classFlag = true;
	} else {
		this.classFlag = false;
	}
  }
  collapse_menu(event:any) {
		$('.vertical_nav').toggleClass('vertical_nav__minify');
		$('.wrapper').toggleClass('wrapper__minify');
		if ($('.wrapper').hasClass('wrapper__minify')){
			$('.vertical_nav').addClass('vertical_nav__minify');
		  } 
	}
	toggleMenu(event:any) {
		$('.vertical_nav').toggleClass('vertical_nav__opened');
		$('.wrapper').toggleClass('toggle-content');
		if ($('.wrapper').hasClass('toggle-content')){
			$('.vertical_nav').addClass('vertical_nav__opened');
		  } 
	}
	
}
