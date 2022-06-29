import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from "jquery";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
	toggleSidebar() {
		if ($('.vertical_nav').hasClass('vertical_nav__minify')){
			$('.vertical_nav').removeClass('vertical_nav__minify');
			$('.wrapper').removeClass('wrapper__minify');
		} 
		if ($('.vertical_nav').hasClass('vertical_nav__opened')){
			$('.vertical_nav').removeClass('vertical_nav__opened');
			$('.wrapper').removeClass('toggle-content');
		}
	}
	
	/**
   * Logout
   */
  onLogout(e:any) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

}
