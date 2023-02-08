import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
@Component({
  selector: 'app-forgetsubpasword',
  templateUrl: './forgetsubpasword.component.html',
  styleUrls: ['./forgetsubpasword.component.css']
})
export class ForgetsubpaswordComponent implements OnInit {
  sending: boolean;
  constructor(private router: Router, private dataService: ApiDataService, private utility: UtilityService) { }
  ngOnInit() {
    this.sending = false;
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    this.sending = true;
    let json: JSON = form.value;
    json['isForget'] = true;
    json['url'] = this.utility.subpasswordResetURL + "/" + json['emailAddress'];
    this.dataService.postData(this.utility.apiData.subUserAccounts.ApiUrl, JSON.stringify(json), true)
      .subscribe(Response => {
        this.sending = false;
        swal('Password Sent Succesfully');
        this.router.navigate(['login']);
      }, error => {
        this.sending = false;
        switch (error.status) {
          case 404: {
            swal("E-Mail ID does not exists,please signup to continue")
            break;
          }
          default: {
            swal("Unable to reset password,please try again");
            break;
          }
        }
      })
  }
}
