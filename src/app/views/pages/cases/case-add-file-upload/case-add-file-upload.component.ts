import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-case-add-file-upload',
	templateUrl: './case-add-file-upload.component.html',
	styleUrls: ['./case-add-file-upload.component.css']
})
export class CaseAddFileUploadComponent implements OnInit {
	public UploadFiles: any[] = []
	public attachmentUploadFiles: any[] = []
	public tabledata: any;
	public module = 'patient';

	public jsonObj = {
		ownerName: '',
		caseId: '',
		patientId: '',
		patientName: '',
		dateCreated: 0,
		files: Array()
	}

	constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private utilitydev: UtilityServicedev) { }

	ngOnInit(): void {
		this.getCaseDetails();
	}
	getTimeStamp(input: any) {
		var date = input.split('/');
		var d = new Date(date[2], date[0] - 1, date[1]);
		return d.getTime();
	}
	getCaseDetails() {
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = sessionStorage.getItem("invitecaseId");
		if (caseId != '') {
			url += "?caseId=" + caseId;
		}
		this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response) {
					this.tabledata = JSON.parse(Response.toString());
					//alert(JSON.stringify(this.tabledata));
				}
			}, error => {
				if (error.status === 404)
					swal('E-Mail ID does not exists,please signup to continue');
				else if (error.status === 403)
					swal('Account Disabled,contact Dental-Live');
				else if (error.status === 400)
					swal('Wrong Password,please try again');
				else if (error.status === 401)
					swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
				else if (error.status === 428)
					swal(error.error);
				else
					swal('Unable to fetch the data, please try again');
			});
	}
	getUniqueName(name: any) {
		let i = 0;
		do {
			if (i > 0) name = name.split('.')[0] + '_' + i + '.' + name.split('.')[1];
			i++;
		} while ('');
		return name;
	}

	loadFiles(event: any) {
		if (event.target.files.length > 0) {
			let allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel', 'docx', 'doc', 'xls', 'xlsx', 'txt'];
			if (!allowedtypes.some(type => event.target.files[0]['type'].includes(type))) {
				swal("File Extenion Not Allowed");
				return;
			} else {
				this.attachmentUploadFiles = Array();
				this.attachmentUploadFiles.push({ name: this.getUniqueName(event.target.files[0]['name']), binaryData: event.target.files[0], size: event.target.files[0]['size'], type: event.target.files[0]['type'] });
			}
		}
	}


	onGetdateData(data: any) {
		//alert(data);
		this.jsonObj['ownerName'] = data.resorceowner;
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		this.jsonObj['patientName'] = data.patientname;
		if (data.uploadfile) {
			this.jsonObj['files'] = this.UploadFiles;
		}
		//alert(JSON.stringify(this.jsonObj));

		this.dataService.postData(this.utility.apiData.userCaseFiles.ApiUrl, JSON.stringify(this.jsonObj), true)
			.subscribe(Response => {
				if (Response) Response = JSON.parse(Response.toString());
				swal.close();
				swal('Files added successfully');
				setTimeout(() => {
					this.router.navigate(['cases/case-list']);
				}, 1000);
			}, error => {
				if (error.status === 404)
					swal('E-Mail ID does not exists,please signup to continue');
				else if (error.status === 403)
					swal('Account Disabled,contact Dental-Live');
				else if (error.status === 400)
					swal('Wrong Password,please try again');
				else if (error.status === 401)
					swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
				else if (error.status === 428)
					swal(error.error);
				else
					swal('Unable to fetch the data, please try again');
			});
	}


	onSubmitFiles(form: NgForm) {
		if (form.invalid) {
			form.form.markAllAsTouched();
			return;
		}

		if (form.value.uploadfile) {
			swal("Processing...please wait...", {
				buttons: [false, false],
				closeOnClickOutside: false,
			});
			let mediatype = this.attachmentUploadFiles[0].type;
			let mediasize = Math.round(this.attachmentUploadFiles[0].size / 1024);
			let requests = this.attachmentUploadFiles.map((object) => {
				return this.utilitydev.uploadBinaryData(object["name"], object["binaryData"], this.module);
			});
			Promise.all(requests)
				.then((values) => {
					this.attachmentUploadFiles = [];
					//console.log(this.cvfast);
					let img = values[0];
					let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name=' + img + '&module=' + this.module + '&type=get';
					this.dataService.getallData(url, true)
						.subscribe(Response => {
							if (Response) {
								this.UploadFiles = Array();
								this.UploadFiles.push({
									url: Response,
									name: img,
									mediaType: mediatype,
									mediaSize: mediasize.toString()
								});
								//this.PatientImg = values[0];
								this.onGetdateData(form.value);
							}
						}, error => {
							if (error.status === 404)
								swal('E-Mail ID does not exists,please signup to continue');
							else if (error.status === 403)
								swal('Account Disabled,contact Dental-Live');
							else if (error.status === 400)
								swal('Wrong Password,please try again');
							else if (error.status === 401)
								swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
							else if (error.status === 428)
								swal(error.error);
							else
								swal('Unable to fetch the data, please try again');
						});
				})
				.catch((error) => {
					console.log(error);
					return false;
				});
		}
		else {
			this.onGetdateData(form.value);
		}
	};
}
