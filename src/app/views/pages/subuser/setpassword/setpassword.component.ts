import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';

@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.css']
})
export class SetpasswordComponent implements OnInit {

  sending: boolean;
  subUserId: string;
  dentalID: string;
  verification: string;

  constructor(private router: Router, private route: ActivatedRoute, private dataService: ApiDataService, public utility: UtilityService) { }

  ngOnInit() {
    this.sending = false;
    this.route.paramMap.subscribe(params => {
      if (params.get('dentalID') && params.get('dentalID') != "" && params.get('subUserId') && params.get('subUserId') != "" && params.get('verification') && params.get('verification') != "") {
        this.subUserId = params.get('subUserId');
        this.verification = params.get('verification');
        this.dentalID = params.get('dentalID');
      } else {
        swal("Validation failed,please contact support@dentallive.com");
        this.sending = false;
        this.router.navigate(['/login']);
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
    json['isValidate'] = true;
    json['subUserId'] = this.subUserId
    json['verificationNo'] = this.verification;
    json['dentalID'] = this.dentalID;
    json['password'] = json['npassword'];

    this.dataService.postData(this.utility.apiData.subUserAccounts.ApiUrl, JSON.stringify(json))
      .subscribe(Response => {
        swal("Password created successfully")
        this.sending = false;
        this.router.navigate(['/login']);
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
