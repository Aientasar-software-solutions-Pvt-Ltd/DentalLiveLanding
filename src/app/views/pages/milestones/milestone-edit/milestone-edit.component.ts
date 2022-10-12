//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

import { OwlDateTimeIntl } from 'ng-pick-datetime';
import "@lottiefiles/lottie-player";
import {encode} from 'html-entities';
import {decode} from 'html-entities';

@Component({
  selector: 'app-milestone-edit',
  templateUrl: './milestone-edit.component.html',
  styleUrls: ['./milestone-edit.component.css']
})
export class MilestoneEditComponent implements OnInit {
  @ViewChild(Cvfast) cvfastval!: Cvfast;
	sending: boolean;
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
	  milestoneId: '',
	}
	editdata:any;
	editedDate:any;
	editedTitle:any;
	editedstartDate:any;
	tabledata:any;
	patientId:any;
	caseId:any;
	public casesName = '';
	public patientName = '';
	public isvalidDate = false;
	minDate = new Date();
	
	getmilestoneId: any;
    constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService, private route: ActivatedRoute) {
		this.getmilestoneId = this.route.snapshot.paramMap.get('milestoneId');
	}
  
	back(): void {
		this.location.back()
	}
	
  ngOnInit(): void {
  this.getEditMilestone();
  }
	
	getEditMilestone() {
		this.editdata = '';
		let url = this.utility.apiData.userMilestones.ApiUrl;
		let milestoneId = this.getmilestoneId;
		if(milestoneId != '')
		{
			url += "?milestoneId="+milestoneId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				
				this.editdata = JSON.parse(Response.toString());
				this.setcvFast();
				this.editedDate = new Date(this.editdata.duedate);
				this.editedstartDate = new Date(this.editdata.startdate);
				this.getCaseDetails(this.editdata.caseId);
				this.editedTitle = decode(this.editdata.title);
			}
		}, error => {
			if (error.status === 404)
			swal('No milestone found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered');
			else if (error.status === 405)
			swal({
			text: 'Due to dependency data unable to complete operation'
			}).then(function() {
			window.location.reload();
			});
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
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
		  swal("Please enter values for the mandatory fields");
		  form.form.markAllAsTouched();
		  return;
		}
		this.sending = true;
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		
		this.jsonObj['milestoneId'] = data.milestoneId;
		this.jsonObj['title'] = this.removeHTML(data.title);
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
		this.jsonObj['description'] = this.cvfastval.returnCvfast();
		}
		//this.jsonObj['description'] = data.description;
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['duedate'] = Date.parse(data.dueDatetime);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['reminder'] = Number(data.reminder);
		this.jsonObj['caseId'] = this.caseId;
		this.jsonObj['patientId'] = this.patientId;
		this.jsonObj['patientName'] = this.patientName;
		
		const backurl = sessionStorage.getItem('backurl');
		
		this.cvfastval.processFiles(this.utility.apiData.userMilestones.ApiUrl, this.jsonObj, true, 'Milestone updated successfully', backurl, 'put','','description','','Milestone title already exists.').then(
		(value) => {
		this.sending = false;
		},
		(error) => {
		this.sending = false;
		});
		
	}
	
	getCaseDetails(caseId) {
		let url = this.utility.apiData.userCases.ApiUrl;
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
					this.patientId = this.tabledata.patientId;
					this.caseId = this.tabledata.caseId;
				}
			}, error => {
				if (error.status === 404)
				swal('No milestone found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered');
				else if (error.status === 405)
				swal({
				text: 'Due to dependency data unable to complete operation'
				}).then(function() {
				window.location.reload();
				});
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			});
		}
	}
	setcvFast()
	{
		this.cvfastval.setCvfast(this.editdata.description);
	}
	
	removeHTML(str){ 
		if((str != '') && (str != 'undefined') && (str != undefined))
		{
		var tmp = document.createElement("DIV");
		tmp.innerHTML = str;
		return tmp.textContent || tmp.innerText || "";
		}
		else
		{
		return "";
		}
	}
}