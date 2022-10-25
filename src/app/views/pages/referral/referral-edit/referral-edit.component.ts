//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReferralGuideComponent } from '../referral-guide/referral-guide.component';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import { ChangeDetectorRef } from '@angular/core';
import {encode} from 'html-entities';
import {decode} from 'html-entities';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-referral-edit',
  templateUrl: './referral-edit.component.html',
  styleUrls: ['./referral-edit.component.css']
})
export class ReferralEditComponent implements OnInit {
	@ViewChild(Cvfast) cv!: Cvfast;
	sending: false;
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
    selectedCity: any;
    selectedCityName: any[] = []
	
	public jsonObj = {
	  referralId: '',
	  caseId: '',
	  patientId: '',
	  title: '',
	  notes: {},
	  toothguide: {},
	  duedate: 0,
	  startdate: 0,
	  enddate: 0,
	  presentStatus: 0
	}
	public casesName = '';
	public patientName = '';
	public startDateEdit = 0;
	public endDateEdit = 0;
	public presentStatusEdit = 0;
	tabledata:any;
	editedDate:any;
	toothData = '';
	editedDateTitle:any;
	minDate = new Date();
	public isvalidDate = false;
	public isvalidRefereTo = false;
	
	public isvalidToothGuide = false;
    referralId:any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService, private route: ActivatedRoute, private cd: ChangeDetectorRef)  {
	this.referralId = this.route.snapshot.paramMap.get('referralId');
	}
  
	@ViewChild(ReferralGuideComponent)	orders: ReferralGuideComponent;
	
	public patientImg: any;
	
	back(): void {
		this.location.back()
	}
	ngOnInit(): void {
		
		this.getEditReferral();
		/*callback function
		this.getEditReferral().then(
		(value) => {
		},
		(error) => {
		});*/
	}
	getEditReferral() {
		let url = this.utility.apiData.userReferrals.ApiUrl;
		let referralId = this.referralId;
		if(referralId != '')
		{
			url += "?referralId="+referralId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				
				this.editedDate = JSON.parse(Response.toString());
				this.getAllMembers(this.editedDate.caseId,this.editedDate.members);
				this.toothData = this.editedDate.toothguide;
				console.log("calling tooth guide");
				console.log(this.orders);
				console.log(this.toothData);
				this.orders.setToothGuide(this.toothData);
				this.editedDateTitle = decode(this.editedDate.title);
				this.startDateEdit = this.editedDate.startdate;
				this.endDateEdit = this.editedDate.enddate;
				this.presentStatusEdit = this.editedDate.presentStatus;
				this.allMemberEmail = this.editedDate.members;
				this.getCaseDetails(this.editedDate.caseId);
				this.setcvFast();   
			}
		}, error => {
			if (error.status === 404)
			swal('No referral found');
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
	getEditReferral() {
		return new Promise((Resolve, myReject) => {
			let url = this.utility.apiData.userReferrals.ApiUrl;
			let referralId = this.referralId;
			if(referralId != '')
			{
				url += "?referralId="+referralId;
			}
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					
					this.editedDate = JSON.parse(Response.toString());
					this.toothData = this.editedDate.toothguide;
					console.log("calling tooth guide");
					console.log(this.orders);
					console.log(this.toothData);
					this.orders.setToothGuide(this.toothData);
					this.editedDateTitle = decode(this.editedDate.title);
					this.startDateEdit = this.editedDate.startdate;
					this.endDateEdit = this.editedDate.enddate;
					this.presentStatusEdit = this.editedDate.presentStatus;
					this.allMemberEmail = this.editedDate.members;
					this.getCaseDetails(this.editedDate.caseId);
					this.getAllMembers(this.editedDate.caseId,this.editedDate.members);
					Resolve(true);
					this.setcvFast();   
				}
			}, error => {
				Resolve(true);
				if (error.status === 404)
				swal('No referral found');
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
	onSubmitReferral(form: NgForm){
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
			swal("Referal start date should be greater than or equal to today date.");
			return;
		}
		
		if ((form.invalid) || (this.isvalidDate == true) || (this.isvalidToothGuide == true) || (this.isvalidRefereTo == true)) {
		  swal("Please enter values for the mandatory fields");
		  form.form.markAllAsTouched();
		  return;
		}
		
		this.sending = true;
		this.onGetalldata(form.value);
	}
	
	onGetalldata(data: any)
	{
		this.jsonObj['referralId'] = data.referralId;
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		if(data.milestoneId)
		{
		this.jsonObj['milestoneId'] = data.milestoneId;
		}
		this.jsonObj['title'] = this.removeHTML(data.title);
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['members'] = this.allMemberEmail;
		const backurl = sessionStorage.getItem('backurl');
		
		this.cv.processFiles(this.utility.apiData.userReferrals.ApiUrl, this.jsonObj, true, 'Referral Updated successfully', backurl, 'put', '','notes','','Referal title already exists.').then(
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
	setcvFast()
	{
		this.cv.setCvfast(this.editedDate.notes);
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
				}
			}, error => {
				if (error.status === 404)
				swal('No referral found');
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
