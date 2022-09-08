import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { AccountService } from '../../account.service';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { PermissionGuardService } from '../../permission-guard.service';
import { AccdetailsService } from '../../accdetails.service';
@Component({
  selector: 'app-validate-sucess',
  templateUrl: './validate-sucess.component.html',
  styleUrls: ['./validate-sucess.component.css']
})
export class ValidateSucessComponent implements OnInit {
  sending: boolean;
  constructor(private router: Router, private route: ActivatedRoute, private accService: AccountService, private utility: UtilityService, private dataService: ApiDataService, private permAuth: PermissionGuardService, private usr: AccdetailsService) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if ((params.get('mail') && params.get('mail') != "") && (params.get('random') && params.get('random') != "")) {
        this.sending = true;
        let json = {};
        json['isValidate'] = true;
        json['emailAddress'] = params.get('mail');
        json['verificationNo'] = params.get('random');
        this.dataService.postData(this.utility.apiData.userAccounts.ApiUrl, JSON.stringify(json))
          .subscribe(Response => {
            this.sending = false;
          }, error => {
            swal("Validation failed,please contact support@dentallive.com");
            this.sending = false;
            this.router.navigate(['/auth/login']);
          });
      }
    });
  };
}
