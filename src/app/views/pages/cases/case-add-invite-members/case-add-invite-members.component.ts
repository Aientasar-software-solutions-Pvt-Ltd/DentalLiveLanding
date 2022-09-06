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
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
	public allMemberDentalId: any[] = []
    selectedCity = '';
	
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
		this.getAllMembers();
	}
	
	getCaseDetails() {
		swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		});
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = localStorage.getItem("invitecaseId");
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
			swal('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			swal('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			swal('Wrong Password,please try again');
		  else if (error.status === 401)
			swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			swal(error.error);
		  else
			swal('Unable to fetch the data, please try again');
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
			for(var k = 0; k < Colleague.length; k++)
			{
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
					avatar = '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x';
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
			//alert(JSON.stringify(this.allMember));
		}
		}, (error) => {
		  swal("Unable to fetch data, please try again");
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
		let user = this.usr.getUserDetails(false);
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		var z=0;
		for(var i = 0; i < this.allMemberEmail.length; i++)
		{
			this.jsonObjInvite['resourceOwner'] = user.dentalId;
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
			z++;
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
}