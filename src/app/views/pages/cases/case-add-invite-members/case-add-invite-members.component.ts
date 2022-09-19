import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';	
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-case-add-invite-members',
  templateUrl: './case-add-invite-members.component.html',
  styleUrls: ['./case-add-invite-members.component.css']
})
export class CaseAddInviteMembersComponent implements OnInit {

	@ViewChild(Cvfast) cvfastval!: Cvfast;
	sending = false;
	public inviteEmailArray: any[] = []
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
	public allMemberDentalId: any[] = []
    selectedCity = '';
	public isvalidDate = false;
	isLoadingData = true;
	invitedata:any;
	
	public jsonObjInvite = {
		patientId: '',
		caseId: '',
		patientName: '',
		invitationText: {},
		invitedUserMail: '',
		invitedUserId: '',
		presentStatus: 0
	}
	
	public tabledata:any;
	public jsonObjInviteEdit = {
		patientId: '',
		caseId: '',
		patientName: '',
		invitedUserMail: '',
		invitedUserId: '',
		invitationId: "",
		presentStatus: 3
		//responseText: {}
	}
	
	constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev) { }

	ngOnInit(): void {
		this.getCaseDetails();
		this.getInviteListing();
	}
	
	getCaseDetails() {
		swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		});
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = sessionStorage.getItem("invitecaseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				swal.close();
				this.tabledata = JSON.parse(Response.toString());
			}
		}, error => {
			if (error.status === 404)
			swal('No member found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for case id or inviteusemail');
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
	
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let Colleague = JSON.parse(Response.toString());
			//alert(JSON.stringify(Colleague));
			this.allMember = Array();
			let checkInviteEmail = this.inviteEmailArray;
			for(var k = 0; k < Colleague.length; k++)
			{
				if (checkInviteEmail.includes(Colleague[k].emailAddress)) {
				}
				else{
					if(user.emailAddress != Colleague[k].emailAddress)
					{
						let name = Colleague[k].accountfirstName+' '+Colleague[k].accountlastName;
						let avatar = ''
						if(Colleague[k].imageSrc != undefined)
						{
						avatar = 'https://dentallive-accounts.s3-us-west-2.amazonaws.com/'+Colleague[k].imageSrc;
						}
						else
						{
						avatar = 'assets/images/users.png';
						}
						this.allMember.push({
						  id: k,
						  avatar: avatar,
						  emailAddress: Colleague[k].emailAddress,
						  dentalId: Colleague[k].dentalId,
						  name: name
						});
					}
				}
			}
			//alert(JSON.stringify(this.allMember));
		}
		}, (error) => {
			if (error.status === 404)
			swal('No member found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for case id or inviteusemail');
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
		this.allMemberEmail = Array();
		this.allMemberName = Array();
		this.allMemberDentalId = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].emailAddress);
			this.allMemberName.push(item[k].name);
			this.allMemberDentalId.push(item[k].dentalId);
		}
		//alert(JSON.stringify(this.allMemberEmail));
		//alert(JSON.stringify(this.allMemberDentalId));
	}
	onSubmitInvite(form: NgForm){
		this.sending = true;
		let user = this.usr.getUserDetails(false);
		if(this.allMemberEmail.length == 0)
		{
			this.isvalidDate =true;
			this.sending = false;
		}
		else
		{
			this.isvalidDate =false;
		}
		if ((form.invalid) || (this.isvalidDate == true)) {
		  form.form.markAllAsTouched();
		  return;
		}
		var z=0;
		for(var i = 0; i < this.allMemberEmail.length; i++)
		{
			z++;
			//this.jsonObjInvite['resourceOwner'] = user.dentalId;
			this.jsonObjInvite['caseId'] = form.value.caseId;
			this.jsonObjInvite['patientId'] = form.value.patientId;
			this.jsonObjInvite['patientName'] = form.value.patientName;
			this.jsonObjInvite['presentStatus'] = 0;
			if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
			{
				this.jsonObjInvite['invitationText'] = this.cvfastval.returnCvfast();
			}
			
			this.jsonObjInvite['invitedUserMail'] = this.allMemberEmail[i];
			this.jsonObjInvite['invitedUserId'] = this.allMemberDentalId[i];
			
			//alert(JSON.stringify(this.jsonObjInvite));
			if(z == this.allMemberEmail.length)
			{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, 'Invitation send successfully', 'cases/case-add-milestone', 'post', '','invitationText');
			}
			else
			{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, '', '', 'post', '','invitationText');
			}
		}
	};
	
	getInviteListing() {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		let caseId = sessionStorage.getItem("invitecaseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		url += "&resourceOwner="+user.emailAddress;
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.isLoadingData = false;
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				this.invitedata = Array();
				this.inviteEmailArray = Array();
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedata.push({
					  id: k,
					  patientId: GetAllData[k].patientId,
					  invitedUserId: GetAllData[k].invitedUserId,
					  invitedUserMail: GetAllData[k].invitedUserMail,
					  invitationId: GetAllData[k].invitationId,
					  userName: '',
					  presentStatus: GetAllData[k].presentStatus,
					  invitationText: GetAllData[k].invitationText,
					  patientName: GetAllData[k].patientName,
					  caseId: GetAllData[k].caseId,
					  dateUpdated: GetAllData[k].dateUpdated,
					  resourceOwner: GetAllData[k].resourceOwner
					});
					this.inviteEmailArray.push(GetAllData[k].invitedUserMail);
					//this.getuserdetailsall(GetAllData[k].invitedUserMail,k);
				}
				this.getAllMembers();
			}
		}, error => {
		  this.getAllMembers();
			if (error.status === 404)
			swal('No member found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for case id or inviteusemail');
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
	
	onSubmitInviteNew(form: NgForm){
		let user = this.usr.getUserDetails(false);
		
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		
		let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/sendinvite';
	
		url += "?caseId="+form.value.caseId+'&name='+form.value.name+'&email='+form.value.email;
		
		this.dataService.getallData(url, true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  swal('New member invited successfully');
		}, error => {
			swal({
				text: error.error
			}).then(function() {
				window.location.reload();
			});
		});
	};
}