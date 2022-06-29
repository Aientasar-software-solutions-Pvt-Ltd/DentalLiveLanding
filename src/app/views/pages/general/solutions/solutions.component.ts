import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { NgwWowService } from 'ngx-wow';
import { Observable } from 'rxjs';
import {Md5} from "ts-md5/dist/md5";

const baseURL = 'https://oms5sh4336.execute-api.us-west-2.amazonaws.com/default/packages';
const endPoint = 'https://crm.dentallive.com/webservice.php';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {
	currentYear: number = new Date().getFullYear();
	solutionform!: FormGroup;
	product = {
		email_id: ''
	};
	tokenData: any;
	preparekey: any;
	userData: any;
	sessionName: any;
	UserId: any;
	success = false;
    submitted = false;
  constructor(private wowService: NgwWowService, private http: HttpClient, private fb: FormBuilder) {
	this.wowService.init();
  }

  ngOnInit(): void {
	 //this.readPackages();
	 //this.createProduct();
	this.solutionform = this.fb.group(
	  {
		email_id: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
	  }
	);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.solutionform.controls;
  }
  createProduct(): void {
	this.submitted = true;
	if (this.product.email_id =='') {
	   return;
	}
	this.http.get(endPoint+'?operation=getchallenge&username=website')
      .subscribe(
        resResult => {
            let md5 = new Md5();
			this.tokenData = resResult;
			md5.appendStr(this.tokenData.result.token+'FMqgYT31MuPNks55');
			// Generate the MD5 hex string
			this.preparekey = md5.end();
			this.getUserid();
        },
        error => {
          console.log(error);
        });
  }
  getUserid(): void {
	var data = new FormData();
    data.append("operation", 'login');
    data.append('username', 'website');
    data.append('accessKey', this.preparekey);
	this.http.post(endPoint,data)
      .subscribe(
        res => {
			this.userData = res;
			this.sessionName = this.userData.result.sessionName;
			this.UserId = this.userData.result.userId;
			this.subscriptionEmail();
			//this.contactUsEmail();
        },
        error => {
			//alert(JSON.stringify(error));
          console.log(error);
        });
  }
  subscriptionEmail(): void {
	let params = {
	  "lastname": "testLead",
	  "email": this.product.email_id,
	  "assigned_user_id": this.UserId
	};
	var data = new FormData();
    data.append("operation", 'create');
    data.append("sessionName", this.sessionName);
    data.append('element', JSON.stringify(params));
    data.append('elementType', 'Leads');
	this.http.post(endPoint,data)
      .subscribe(
        result => {
			//alert(JSON.stringify(result));
			this.product.email_id = '';
			this.submitted = false;
			this.success = true;
			setTimeout (() => {
				this.success = false;
			}, 2000);
        },
        error => {
			//alert(JSON.stringify(error));
          console.log(error);
        });
  }
}
