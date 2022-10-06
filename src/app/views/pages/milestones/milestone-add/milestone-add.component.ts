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
import "@lottiefiles/lottie-player";
import {encode} from 'html-entities';

@Component({
  selector: 'app-milestone-add',
  templateUrl: './milestone-add.component.html',
  styleUrls: ['./milestone-add.component.css']
})
export class MilestoneAddComponent implements OnInit {
	sending: boolean;
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	public isvalidDate = false;
	
	public allcases: any[] = []
	public caseid = '';
	public patientid = '';
	public casesName = '';
	public patientName = '';
	public parmCaseId = '';
	checkCase = '';
	minDate = new Date();
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
  constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService, private route: ActivatedRoute) { 
  this.parmCaseId = this.route.snapshot.paramMap.get('caseId');
  this.checkCase = this.route.snapshot.paramMap.get('caseId');
  }
  
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
		  swal("Please enter values for the mandatory fields");
		  form.form.markAllAsTouched();
		  return;
		}
		this.sending = true;
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['title'] = this.removeHTML(data.title);
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
		this.jsonObj['description'] = this.cvfastval.returnCvfast();
		}
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['duedate'] = Date.parse(data.dueDatetime);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['reminder'] = Number(data.reminder);
		
		const backurl = sessionStorage.getItem('backurl');
		
		this.cvfastval.processFiles(this.utility.apiData.userMilestones.ApiUrl, this.jsonObj, true, 'Milestone added successfully', backurl, 'post', '','description','','Milestone title already exists.').then(
		(value) => {
		this.sending = false;
		},
		(error) => {
		this.sending = false;
		});
	}
	
	getAllCases() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		this.sending = true;
		let url = this.utility.apiData.userCases.ApiUrl;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				
				this.tabledataAll = JSON.parse(Response.toString());
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
				this.sending = false;
			}
		}, (error) => {
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
			return false;
		});
		}
	}
	
	selectEvent(item: any) {
		this.caseid = item.caseId;
		this.patientid = item.patientId;
		this.patientName = item.patientName;
		this.casesName = item.name;
	}
	getCaseDetails() {
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = this.parmCaseId;
		if(caseId != 0)
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