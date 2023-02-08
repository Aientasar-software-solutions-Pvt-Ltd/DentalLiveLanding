import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {

  sending: boolean;
  email: string;
  randNo: string;

  constructor(private router: Router, private route: ActivatedRoute, private Service: ApiDataService, private utility: UtilityService,) { }

  ngOnInit() {
    this.sending = false;
    this.route.paramMap.subscribe(params => {
      if (params.get('email') && params.get('email') != "" && params.get('randNo') && params.get('randNo') != "") {
        this.email = params.get('email');
        this.randNo = params.get('randNo');
      } else {
        swal("Invalid request,please contact support@dentallive.com");
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
    json['emailAddress'] = this.email
    json['randNo'] = this.randNo;
    json['password'] = json['cpassword'];
    json['isForget'] = true;
    json['isUpdate'] = true;

    this.Service.postData(this.utility.apiData.userAccounts.ApiUrl, JSON.stringify(json), true)
      .subscribe(Response => {
        if (Response) Response = JSON.parse(Response.toString());
        swal("Account Details Updated Successfully")
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
