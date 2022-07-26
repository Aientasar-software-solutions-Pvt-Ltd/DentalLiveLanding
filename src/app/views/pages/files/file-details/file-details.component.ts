import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/angular'; 
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {
	public filedetails: any;
	public tabledata: any;
	
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev) { }

  ngOnInit(): void {
  this.getFileDetails();
  this.getCaseDetails();
  }
  
	getFileDetails() {
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		let fileUploadId = sessionStorage.getItem("fileUploadId");
		if(fileUploadId != '')
		{
			url += "?fileUploadId="+fileUploadId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.filedetails = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.filedetails));
			}
		}, error => {
		  if (error.status === 404)
			swal.fire('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			swal.fire('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			swal.fire('Wrong Password,please try again');
		  else if (error.status === 401)
			swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			swal.fire(error.error);
		  else
			swal.fire('Unable to fetch the data, please try again');
		});
	}
	
	getCaseDetails() {
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = sessionStorage.getItem("caseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.tabledata));
			}
		}, error => {
		  if (error.status === 404)
			swal.fire('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			swal.fire('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			swal.fire('Wrong Password,please try again');
		  else if (error.status === 401)
			swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			swal.fire(error.error);
		  else
			swal.fire('Unable to fetch the data, please try again');
		});
	}
	
	deleteFile(fileUploadId: any) {
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		this.dataService.deleteFilesData(url, fileUploadId).subscribe(Response => {
			swal.fire("Case Files deleted successfully");
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		this.router.navigate(['files/files']);
	}
}
