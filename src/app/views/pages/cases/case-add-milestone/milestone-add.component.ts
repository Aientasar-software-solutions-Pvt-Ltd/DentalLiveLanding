//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-milestone-add',
  templateUrl: './milestone-add.component.html',
  styleUrls: ['./milestone-add.component.css']
})
export class MilestoneAddComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	sending = false;
	public isvalidDate = false;
	
	public allcases: any[] = []
	public caseid = '';
	public patientid = '';
	public casesName = '';
	public patientName = '';
	checkCase = '1';
	public jsonObj = {
	  caseId: '',
	  patientId: '',
	  patientName: '',
	  title: '',
	  description: {},
	  startdate: 0,
	  duedate: 0,
	  presentStatus: 0,
	  reminder: 0,
	}
	tabledata:any;
  constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { }
  
	back(): void {
		this.location.back()
	}
	ngOnInit(): void {
		this.getCaseDetails();
		this.getAllCases();
	}
	
	onSubmitMilestone(form: NgForm){
		if(Date.parse(form.value.startdate) >= Date.parse(form.value.dueDatetime))
		{
			this.isvalidDate =true;
		}
		else
		{
			this.isvalidDate =false;
		}
		if ((form.invalid) || (this.isvalidDate == true)) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		this.sending = true;
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['title'] = data.title;
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
		this.jsonObj['description'] = this.cvfastval.returnCvfast();
		}
		//this.jsonObj['description'] = data.description;
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['duedate'] = Date.parse(data.dueDatetime);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['reminder'] = Number(data.reminder);
		
		//alert(JSON.stringify(this.jsonObj));
		
		this.cvfastval.processFiles(this.utility.apiData.userMilestones.ApiUrl, this.jsonObj, true, 'Milestone added successfully', 'cases/case-add-task-add', 'post', 'invitemilestoneId','description');
	}
	
	getAllCases() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
		swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		});
		let url = this.utility.apiData.userCases.ApiUrl;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				swal.close();
				this.tabledataAll = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.tabledataAll));
				this.allcases = Array();
				for(var k = 0; k < this.tabledataAll.length; k++)
				{
					if(this.tabledataAll[k].caseStatus == true)
					{
						let name = this.tabledataAll[k].title;
						this.allcases.push({
						  value: this.tabledataAll[k].caseId,
						  caseId: this.tabledataAll[k].caseId,
						  patientName: this.tabledataAll[k].patientName,
						  patientId: this.tabledataAll[k].patientId,
						  name: name,
						  label: name
						});
					}
				}
				//alert(JSON.stringify(this.allcases));
			}
		}, (error) => {
			if (error.status)
			swal(error.error);
			else
			swal('Unable to fetch the data, please try again');
		  return false;
		});
		}
	}
	
	selectEvent(item: any) {
		//alert(JSON.stringify(item));
		this.caseid = item.caseId;
		this.patientid = item.patientId;
		this.patientName = item.patientName;
		this.casesName = item.name;
	// do something with selected item
	}
	getCaseDetails() {
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = sessionStorage.getItem("invitecaseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					this.casesName = this.tabledata.title;
					this.patientName = this.tabledata.patientName;
					this.caseid = this.tabledata.caseId;
					this.patientid = this.tabledata.patientId;
					//alert(JSON.stringify(this.tabledata));
				}
			}, error => {
				if (error.status)
				swal(error.error);
				else
				swal('Unable to fetch the data, please try again');
			});
		}
	}
}