import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';

@Component({
  selector: 'app-subpassword',
  templateUrl: './subpassword.component.html',
  styleUrls: ['./subpassword.component.css']
})

export class SubpasswordComponent implements OnInit {

  sending: boolean;
  emailAddress: string;
  random: string;
  submailAddress: string;

  constructor(private router: Router, private dataService: ApiDataService, private utility: UtilityService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sending = false;
    this.route.paramMap.subscribe(params => {
      if (params.get('mail') && params.get('mail') != "" && params.get('submail') && params.get('submail') != "" && params.get('random') && params.get('random') != "") {
        this.emailAddress = params.get('mail');
        this.submailAddress = params.get('submail');
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
    json['emailAddress'] = this.emailAddress
    json['random'] = this.random;
    json['submailAddress'] = this.submailAddress;

    this.dataService.postData(this.utility.apiData.subUserAccounts.ApiUrl, JSON.stringify(json))
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