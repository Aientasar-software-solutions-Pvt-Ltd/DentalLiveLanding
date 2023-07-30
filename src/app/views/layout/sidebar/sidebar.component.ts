import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from "jquery";
import { PermissionGuardService } from '../../pages/permission-guard.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  auth = null;
  constructor(private router: Router, permAuth: PermissionGuardService) {
    this.auth = permAuth;
  }

  ngOnInit(): void {
  }
  toggleSidebar() {
    if ($('.vertical_nav').hasClass('vertical_nav__minify')) {
      $('.vertical_nav').removeClass('vertical_nav__minify');
      $('.wrapper').removeClass('wrapper__minify');
    }
    if ($('.vertical_nav').hasClass('vertical_nav__opened')) {
      $('.vertical_nav').removeClass('vertical_nav__opened');
      $('.wrapper').removeClass('toggle-content');
    }
  }

  /**
   * Logout
   */
  onLogout(e: any) {
    e.preventDefault();
    sessionStorage.removeItem('isLoggedin');
    

    if (!sessionStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

}
