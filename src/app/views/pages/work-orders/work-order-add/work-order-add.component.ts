//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { WorkOrderGuideComponent } from '../work-order-guide/work-order-guide.component';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-work-order-add',
  templateUrl: './work-order-add.component.html',
  styleUrls: ['./work-order-add.component.css']
})
export class WorkOrderAddComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	public isvalidDate = false;
	public isvalidToothGuide = false;
	public jsonObj = {
	  caseId: '',
	  patientId: '',
	  title: '',
	  notes: {},
	  startdate: 0,
	  enddate: 0,
	  toothguide: {},
	  milestoneId: '',
	  presentStatus: 0,
	  patientName: '',
	}
	minDate = new Date();
	tabledata:any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService) { }
	
	@ViewChild(WorkOrderGuideComponent)
	orders: WorkOrderGuideComponent;
	
	back(): void {
		this.location.back()
	}
	
	ngOnInit(): void {
		this.getCaseDetails()
	}
	
	onSubmitWorkOrders(form: NgForm){
		let toothGuilde = JSON.stringify(this.orders.getToothGuide());
		if(Date.parse(form.value.startdate) >= Date.parse(form.value.enddate))
		{
			this.isvalidDate =true;
		}
		else
		{
			this.isvalidDate =false;
		}
		if(toothGuilde.length == 2)
		{
			this.isvalidToothGuide =true;
		}
		else
		{
			this.isvalidToothGuide =false;
		}
		if ((form.invalid) || (this.isvalidDate == true) || (this.isvalidToothGuide == true)) {
		  
		  form.form.markAllAsTouched();
		  return;
		}
		//alert(JSON.stringify(this.orders.getToothGuide()));
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		if(data.milestoneid !='')
		{
			this.jsonObj['milestoneId'] = data.milestoneid;
		}
		this.jsonObj['title'] = data.title;
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['patientName'] = data.patientName;
		
		
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
			this.jsonObj['notes'] = this.cvfastval.returnCvfast();
		}
		
		//alert(JSON.stringify(this.jsonObj));
		
		this.dataService.postData(this.utility.apiData.userWorkOrders.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  swal.fire('Work order added successfully');
		  this.router.navigate(['/master']);
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
		var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
		swal.fire({
			html: sweet_loader,
			icon: "https://www.boasnotas.com/img/loading2.gif",
			showConfirmButton: false,
			allowOutsideClick: false,     
			closeOnClickOutside: false,
			timer: 2200,
			//icon: "success"
		});
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
}