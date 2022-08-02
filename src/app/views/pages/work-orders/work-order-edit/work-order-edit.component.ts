import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WorkOrderGuideComponent } from '../work-order-guide/work-order-guide.component';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-order-edit',
  templateUrl: './work-order-edit.component.html',
  styleUrls: ['./work-order-edit.component.css']
})
export class WorkOrderEditComponent implements OnInit {

	@ViewChild(Cvfast) cv!: Cvfast;
	public isvalidDate = false;
	public isvalidToothGuide = false;
	minDate = new Date();
	saveActiveInactive: boolean = false;
	
	tabledata:any;
	toothData:any;
	
	public patiantStatus = false;
	
	onActiveInactiveChanged(value:boolean){
		this.saveActiveInactive = value;
		this.patiantStatus = value;
	}
	public jsonObj = {
	  workorderId: '',
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
	maxDate = new Date();
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private utilitydev: UtilityServicedev) { }
	
	@ViewChild(WorkOrderGuideComponent)
	orders: WorkOrderGuideComponent;
	
	back(): void {
		this.location.back()
	}
  
	ngOnInit(): void {
		this.getallworkorder();
	}
	onSubmitWorkOrders(form: NgForm) {
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
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		this.jsonObj['workorderId'] = data.workorderId;
		this.jsonObj['caseId'] = data.caseId;
		this.jsonObj['patientId'] = data.patientId;
		if(data.milestoneId !='')
		{
			this.jsonObj['milestoneId'] = data.milestoneId;
		}
		this.jsonObj['toothguide'] = {};
		this.jsonObj['title'] = data.title;
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['patientName'] = data.patientName;
		
		if((this.cv.returnCvfast().text != '') || (this.cv.returnCvfast().links.length > 0))
		{
			//alert(JSON.stringify(this.cv.returnCvfast()));
			this.jsonObj['notes'] = this.cv.returnCvfast();
		}
		
		//alert(JSON.stringify(this.jsonObj));
		
		this.dataService.putData(this.utility.apiData.userWorkOrders.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  swal.fire('WorkOrders updated successfully');
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
	
	getallworkorder() {
		let url = this.utility.apiData.userWorkOrders.ApiUrl;
		let workorderId = sessionStorage.getItem("workorderId");
		if(workorderId != '')
		{
			url += "?workorderId="+workorderId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.tabledata.toothguide));
				this.toothData = this.tabledata.toothguide;
				setTimeout(()=>{     
					this.setcvFast();
				}, 1000);
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
	
	setcvFast()
	{
		this.cv.setCvfast(this.tabledata.notes);
	}
	
	ngAfterViewInit() {
		this.orders.setToothGuide(this.toothData)
	}
}