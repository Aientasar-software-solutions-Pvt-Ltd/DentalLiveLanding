//@ts-nocheck
import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA , AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { WorkOrderGuideComponent } from '../work-order-guide/work-order-guide.component';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import { Router, ActivatedRoute } from '@angular/router';
import {encode} from 'html-entities';
import {decode} from 'html-entities';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-work-order-edit',
  templateUrl: './work-order-edit.component.html',
  styleUrls: ['./work-order-edit.component.css']
})
export class WorkOrderEditComponent implements OnInit {
	sending: boolean = false;
	@ViewChild(Cvfast) cv!: Cvfast;
	name = 'this is from app compoenent';
	@ViewChild(WorkOrderGuideComponent) orders: WorkOrderGuideComponent;

	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
    selectedCity: any;
    selectedCityName: any[] = []
	public isvalidDate = false;
	public isvalidToothGuide = false;
	public isvalidRefereTo = false;
	minDate = new Date();
	saveActiveInactive: boolean = false;
	public casesName = '';
	public patientName = '';
	public tabledataTitle = '';
	public startDateEdit = 0;
	public endDateEdit = 0;
	public presentStatusEdit = 0;
	tabledata:any;
	
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
	workorderId: any;
	toothData = {"idth4":{"selections":["d1"],"notes":"Test zonica"}};
	//toothData = '';
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private utilitydev: UtilityServicedev, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) { 
		this.workorderId = this.route.snapshot.paramMap.get('workorderId');
	}
	
	back(): void {
		this.location.back()
	}
  
	ngOnInit(): void {

		this.getallworkorder();
		/*callback function
		this.getallworkorder().then(
		(value) => {
		},
		(error) => {
		});*/
	}
	getallworkorder() {
		let url = this.utility.apiData.userWorkOrders.ApiUrl;
		let workorderId = this.workorderId;
		if(workorderId != '')
		{
			url += "?workorderId="+workorderId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
				this.toothData = this.tabledata.toothguide;
				console.log("calling tooth guide");
				console.log(this.orders);
				console.log(this.toothData);
				this.orders.setToothGuide(this.toothData);
				this.allMemberEmail = this.tabledata.members;
				this.tabledataTitle = decode(this.tabledata.title);
				this.startDateEdit = this.tabledata.startdate;
				this.endDateEdit = this.tabledata.enddate;
				this.presentStatusEdit = this.tabledata.presentStatus;
				this.getCaseDetails(this.tabledata.caseId);
				this.getAllMembers(this.tabledata.caseId,this.tabledata.members);
				this.setcvFast();
			}
		}, error => {
			if (error.status === 404)
			swal('No workorder found');
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
	/* Callback function
	getallworkorder() {
		return new Promise((Resolve, myReject) => {
			let url = this.utility.apiData.userWorkOrders.ApiUrl;
			let workorderId = this.workorderId;
			if(workorderId != '')
			{
				url += "?workorderId="+workorderId;
			}
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					this.toothData = this.tabledata.toothguide;
					console.log("calling tooth guide");
					console.log(this.orders);
					console.log(this.toothData);
					this.orders.setToothGuide(this.toothData);
					this.allMemberEmail = this.tabledata.members;
					this.tabledataTitle = decode(this.tabledata.title);
					this.startDateEdit = this.tabledata.startdate;
					this.endDateEdit = this.tabledata.enddate;
					this.presentStatusEdit = this.tabledata.presentStatus;
					this.getCaseDetails(this.tabledata.caseId);
					this.getAllMembers(this.tabledata.caseId,this.tabledata.members);
					Resolve(true);
					this.setcvFast();
				}
			}, error => {
				Resolve(true);
				if (error.status === 404)
				swal('No workorder found');
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
		});
	}*/
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
		if(this.allMemberEmail.length == 0)
		{
			this.isvalidRefereTo =true;
		}
		else
		{
			this.isvalidRefereTo =false;
		}
		
		const now = new Date();
		const cValue = formatDate(now, 'yyyy-MM-dd', 'en-US');
		if(form.value.startdate >= cValue){}else{
			swal("Workorder start date should be greater than or equal to today date.");
			return;
		}
		
		if ((form.invalid) || (this.isvalidDate == true) || (this.isvalidToothGuide == true) || (this.isvalidRefereTo == true)) {
		  swal("Please enter values for the mandatory fields");
		  form.form.markAllAsTouched();
		  return;
		}
		this.sending = true;
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
		this.jsonObj['title'] = this.removeHTML(data.title);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['members'] = this.allMemberEmail;
		
		if((this.cv.returnCvfast().text != '') || (this.cv.returnCvfast().links.length > 0))
		{
			this.jsonObj['notes'] = this.cv.returnCvfast();
		}
		
		const backurl = sessionStorage.getItem('backurl');
		this.cv.processFiles(this.utility.apiData.userWorkOrders.ApiUrl, this.jsonObj, true, 'Work order Updated successfully', backurl, 'put', '','notes','','Workorder title already exists.').then(
		(value) => {
		this.sending = false;
		},
		(error) => {
		this.sending = false;
		});
	}
	
	getuserdetailsallEdit(userId) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let isArray = 0;
			for(var i=0; i < userId.length; i++)
			{
				let url = this.utility.apiData.userColleague.ApiUrl;
				if(userId != '')
				{
					url += "?dentalId="+userId[i];
				}
				this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let userData = JSON.parse(Response.toString());
					let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
					this.selectedCityName.push(name);
					isArray++;
					if(userId.length == isArray)
					{
						this.selectedCity = this.selectedCityName;
					}
				}
				}, (error) => {
				  swal( 'Unable to fetch data, please try again');
				  return false;
				});
			}
		}
	}
	getuserdetailsall(userId, index, arrayObj) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?emailAddress="+userId;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let avatar = ''
			if(userData.imageSrc != undefined)
			{
			avatar = 'https://dentallive-accounts.s3-us-west-2.amazonaws.com/'+userData.imageSrc;
			}
			else
			{
			avatar = 'assets/images/users.png';
			}
			let name = userData.accountfirstName+' '+userData.accountlastName;
			this.allMember[index].name = name;
			this.allMember[index].emailAddress = userData.emailAddress;
			this.allMember[index].avatar = avatar;
			this.allMember[index].memberid = userData.dentalId;
		}
		}, (error) => {
			if (error.status === 404)
			swal('No workorder found');
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
	
	getAllMembers(caseId, arrayObj) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			//let caseId = sessionStorage.getItem("caseId");
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			url += "&presentStatus="+1;
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					let GetAllData = JSON.parse(Response.toString());
					GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.allMember = Array();
					for(var k = 0; k < GetAllData.length; k++)
					{
						this.allMember.push({
						  id: k,
						  avatar: '',
						  emailAddress: '',
						  memberid: '',
						  name: ''
						});
						this.getuserdetailsall(GetAllData[k].invitedUserMail,k,arrayObj);
						if(GetAllData.length == (k+1))
						{
						this.getuserdetailsallEdit(arrayObj);
						}
					}
				}
			}, error => {
				if (error.status === 404)
				swal('No workorder found');
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
	selectEvents(item: any) {
		this.allMemberEmail = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].memberid);
			this.allMemberName.push(item[k].name);
			this.isvalidRefereTo = false;
		}
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
					
					let caseDtls = JSON.parse(Response.toString());
					this.casesName = caseDtls.title;
					this.patientName = caseDtls.patientName;
				}
			}, error => {
				if (error.status === 404)
				swal('No workorder found');
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
		this.cv.setCvfast(this.tabledata.notes);
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