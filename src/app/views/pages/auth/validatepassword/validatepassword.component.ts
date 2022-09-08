import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
@Component({
  selector: 'app-validatepassword',
  templateUrl: './validatepassword.component.html',
  styleUrls: ['./validatepassword.component.css']
})
export class ValidatepasswordComponent implements OnInit {
  sending: boolean;
  id: string;
  random: string;
  validationUrl = "https://lfeoipshwe.execute-api.us-west-2.amazonaws.com/default/etrUsers";
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit() {
    this.sending = false;
    this.route.paramMap.subscribe(params => {
      if (params.get('id') && params.get('id') != "" && params.get('random') && params.get('random') != "") {
        this.id = params.get('id');
        this.random = params.get('random');
      } else {
        swal("Validation failed,please contact support@dentallive.com");
        this.sending = false;
        this.router.navigate(['/auth/login']);
      }
    });
  };
  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    let json: JSON = form.value;
    if (json['cpassword'] != json['npassword']) {
      swal('Password did not match');
      return;
    }
    this.sending = true;
    //special case for etr users instead of id email is used
    json['email'] = this.id;
    json['verificationNo'] = this.random;
    json['password'] = json['cpassword'];
    json['isValidate'] = true;
    this.http.post(this.validationUrl, json)
      .subscribe(Response => {
        swal("Password created successfully")
        this.sending = false;
        this.router.navigate(['/auth/login']);
      }, error => {
        if (error.status == 401) {
          swal("Validation failed,please contact support@dentallive.com");
          this.sending = false;
        }
        error.status == 404 ? swal("User not found") : swal("Error saving data,please try again");;
        this.sending = false;
      })
  }
}
