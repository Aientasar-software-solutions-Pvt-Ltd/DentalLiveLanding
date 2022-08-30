import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  show: boolean = false;
  passwordshow: boolean = false;

  morefields = false;

  constructor(private router: Router) { document.body.style.backgroundColor = "#F7F9FB"; }
  // click event function toggle
  password() {
    this.show = !this.show;
  }
  confpassword() {
    this.passwordshow = !this.passwordshow;
  }


  ngOnInit(): void {
  }
  onRegister(e: any) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }
  ngOnDestroy() {
    document.body.style.backgroundColor = "";
  }

}
