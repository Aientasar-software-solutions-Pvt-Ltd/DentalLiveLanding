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
import {encode} from 'html-entities';

@Component({
  selector: 'app-referral-add',
  templateUrl: './referral-add.component.html',
  styleUrls: ['./referral-add.component.css']
})
export class ReferralAddComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	sending: boolean;
	
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
    selectedCity = '';
	public parmCaseId = '';
	public allcases: any[] = []
	public caseid = '';
	public patientid = '';
	public casesName = '';
	public patientName = '';
	milestoneid = sessionStorage.getItem("checkmilestoneidref");
	checkCase = '';
	public jsonObj = {
	  caseId: '',
	  patientId: '',
	  milestoneId: '',
	  title: '',
	  notes: {},
	  toothguide: {},
	  startdate: 0,
	  enddate: 0,
	  presentStatus: 0
	}
	tabledata:any;
	minDate = new Date();
	public isvalidDate = false;
	public isvalidToothGuide = false;
	public isvalidRefereTo = false;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService, private route: ActivatedRoute) {
	this.parmCaseId = this.route.snapshot.paramMap.get('caseId');
	this.checkCase = this.route.snapshot.paramMap.get('caseId');
	}

	@ViewChild(ReferralGuideComponent)
	orders: ReferralGuideComponent;
	
	back(): void {
		this.location.back()
	}
  
	ngOnInit(): void {
		this.getCaseDetails();
		this.getAllCases();
	}
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
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		if(data.milestoneid)
		{
		this.jsonObj['milestoneId'] = data.milestoneid;
		}
		this.jsonObj['title'] = this.removeHTML(data.title);
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['members'] = this.allMemberEmail;
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		
		
		
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
			this.jsonObj['notes'] = this.cvfastval.returnCvfast();
		}
		
		//alert(JSON.stringify(this.jsonObj));
		const backurl = sessionStorage.getItem('backurl');
		
		this.cvfastval.processFiles(this.utility.apiData.userReferrals.ApiUrl, this.jsonObj, true, 'Referral added successfully', backurl, 'post', '','notes','','Referal title already exists.').then(
		(value) => {
		this.sending = false;
		},
		(error) => {
		this.sending = false;
		});
	}
	
	getAllMembers(caseId) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			url += "&presentStatus="+1;
			//url += "?resourceOwner="+user.dentalId;
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
						  name: '',
						  memberid: ''
						});
						this.getuserdetailsall(GetAllData[k].invitedUserMail,k);
					}
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
	selectEvents(item: any) {
		this.allMemberEmail = Array();
		this.allMemberName = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].memberid);
			this.allMemberName.push(item[k].name);
			this.isvalidRefereTo = false;
		}
		//alert(JSON.stringify(this.allMemberEmail));
		//alert(JSON.stringify(this.allMemberName));
	}
	getuserdetailsall(userId, index) {
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
			//alert(JSON.stringify(this.allMember));
		}
		}, (error) => {
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
			return false;
		});
		}
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
				this.sending = false;
			}
		}, (error) => {
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
		this.getAllMembers(item.caseId);
	// do something with selected item
	}
	
	getCaseDetails() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			let caseId = this.parmCaseId;
			if(caseId != 0)
			{
				this.sending = true;
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
						this.getAllMembers(this.tabledata.caseId);
						this.sending = false;
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