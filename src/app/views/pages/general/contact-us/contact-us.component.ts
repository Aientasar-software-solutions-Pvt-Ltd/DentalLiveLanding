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
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
	scroll(el: HTMLElement) {
		el.scrollIntoView({behavior: 'smooth'});
	}
	currentYear: number = new Date().getFullYear();
	
	contactform!: FormGroup;
	
	product = {
		first_name: '',
		last_name: '',
		mobile_no: '',
		job_title: '',
		company_size: '',
		country: '',
		description: '',
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
	this.contactform = this.fb.group(
	  {
		first_name: ['', Validators.required],
		last_name: ['', Validators.required],
		email_id: ['', [Validators.required, Validators.email]],
		mobile_no: [''],
		job_title: ['', Validators.required],
		company_size: [''],
		country: [''],
		description: ['', Validators.required],
	  }
	);
  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  get f(): { [key: string]: AbstractControl } {
    return this.contactform.controls;
  }
createProduct(): void {
	this.submitted = true;
	if (this.product.email_id =='' || this.product.first_name == '' || this.product.last_name == ''|| this.product.job_title == '' || this.product.description == '') {
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
			//this.subscriptionEmail();
			this.contactUsEmail();
        },
        error => {
			//alert(JSON.stringify(error));
          console.log(error);
        });
  }
  contactUsEmail(): void {
	let params = {
	  "potentialname": this.product.first_name+" "+this.product.last_name,
	  "cf_895": this.product.email_id,
	  "cf_905": this.product.mobile_no,
	  "cf_901": this.product.first_name,
	  "cf_903": this.product.last_name,
	  "cf_899": this.product.country,
	  "cf_897": this.product.company_size,
	  "sales_stage": this.product.job_title,
	  "description": this.product.description,
	  "assigned_user_id": this.UserId
	};
	var data = new FormData();
    data.append("operation", 'create');
    data.append("sessionName", this.sessionName);
    data.append('element', JSON.stringify(params));
    data.append('elementType', 'Potentials');
	this.http.post(endPoint,data)
      .subscribe(
        result => {
			//alert(JSON.stringify(result));
			this.product.first_name = '';
			this.product.last_name = '';
			this.product.email_id = '';
			this.product.mobile_no = '';
			this.product.country = '';
			this.product.job_title = '';
			this.product.description = '';
			this.product.company_size = '';
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
