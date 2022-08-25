import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';	
import { NgForm } from '@angular/forms';								
import { CalendarOptions } from '@fullcalendar/angular'; 
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-case-invitation-list',
  templateUrl: './case-invitation-list.component.html',
  styleUrls: ['./case-invitation-list.component.css']
})
export class CaseInvitationListComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;

	id:any = "Received";
	tabContent(ids:any){
		this.id = ids;
	}
	
	back(): void {
		this.location.back()
	}
  dtOptions: DataTables.Settings = {};
  
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev, private location: Location) { }
  
	public invitedata: any;
	public inviteReceivedData: any;
	public getSubmitData: any;
	public case_id: '';
	public patient_id: '';
	public patient_name: '';
	public invitation_id: '';
	public invited_user_mail: '';
	public invited_user_id: '';
	public statusvalue: '';
	
	public jsonObjInvite = {
		patientId: '',
		caseId: '',
		patientName: '',
		responseText: {},
		invitedUserMail: '',
		invitedUserId: '',
		presentStatus: 1
	}
  ngOnInit(): void {
    this.dtOptions = {
	  dom: '<"datatable-top"f>rt<"datatable-bottom"lip><"clear">',
      pagingType: 'full_numbers',
	  pageLength: 10,
      processing: true,
	  responsive: true,
	  language: {
          search: " <div class='search'><i class='bx bx-search'></i> _INPUT_</div>",
		  lengthMenu: "Items per page _MENU_",
          info: "_START_ - _END_ of _TOTAL_",
		  paginate: {
			first : "<i class='bx bx-first-page'></i>",
			previous: "<i class='bx bx-chevron-left'></i>",
			next: "<i class='bx bx-chevron-right'></i>",
			last : "<i class='bx bx-last-page'></i>"
			},
      }
    };
	this.getInviteListing();
	this.getInviteListingReceived();
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	confirmBox(){
		swal.fire({
		  title: 'Are you sure want to remove?',
		  text: 'You will not be able to recover this file!',
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#0070D2',
		  cancelButtonColor: '#F7517F',
		  confirmButtonText: 'Yes, delete it!',
		  cancelButtonText: 'No, keep it'
		}).then((result) => {
		  if (result.value) {
			swal.fire(
			  'Deleted!',
			  'Your imaginary file has been deleted.',
			  'success'
			)
		  } else if (result.dismiss === swal.DismissReason.cancel) {
			swal.fire(
			  'Cancelled',
			  'Your imaginary file is safe',
			  'error'
			)
		  }
		})
	}
	
	confirmArchive(){
		swal.fire({
		  title: 'Are you sure want to archive?',
		  text: 'You will not be able to undo this file!',
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#0070D2',
		  cancelButtonColor: '#F7517F',
		  confirmButtonText: 'Yes, archive it!',
		  cancelButtonText: 'No, keep it'
		}).then((result) => {
		  if (result.value) {
			swal.fire(
			  'Archived!',
			  'Your imaginary file has been archived.',
			  'success'
			)
		  } else if (result.dismiss === swal.DismissReason.cancel) {
			swal.fire(
			  'Cancelled',
			  'Your imaginary file is no change',
			  'error'
			)
		  }
		})
	}
	
	getInviteListing() {
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 3000
		});
		let user = this.usr.getUserDetails(false);
		//alert(user.dentalId);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		//url += "?invitedUserId="+user.dentalId;
		url += "?resourceOwner="+user.dentalId;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.invitedata = Array();
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
					  dateCreated: GetAllData[k].dateCreated,
					  resourceOwner: GetAllData[k].resourceOwner,
					  dentalId: user.dentalId,
					  caseTitle: ''
					});
					this.getuserdetailsall(GetAllData[k].invitedUserId,k);
					this.getcasedetails(GetAllData[k].caseId,k);
				}
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
	
	getcasedetails(caseId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let caseData = JSON.parse(Response.toString());
				this.invitedata[index].caseTitle = caseData.title;
				//alert(JSON.stringify(this.invitedata));
			}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	getuserdetailsall(userId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?dentalId="+userId;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			//alert(JSON.stringify(userData));
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			this.invitedata[index].userName = name;
			//alert(JSON.stringify(this.invitedata));
		}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
	
	onSubmitInvite(form: NgForm){
		
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.jsonObjInvite['invitationId'] = form.value.invitationId;
		this.jsonObjInvite['caseId'] = form.value.caseId;
		this.jsonObjInvite['patientId'] = form.value.patientId;
		this.jsonObjInvite['patientName'] = form.value.patientName;
		this.jsonObjInvite['presentStatus'] = Number(form.value.presentStatus);
		this.jsonObjInvite['invitedUserMail'] =  form.value.invitedUserMail;
		this.jsonObjInvite['invitedUserId'] =  form.value.invitedUserId;
		let status_check = Number(form.value.presentStatus);
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
			this.jsonObjInvite['responseText'] = this.cvfastval.returnCvfast();
		}
		
		//alert(JSON.stringify(this.jsonObjInvite));
		if(status_check == 1){
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, 'Invitation accepted successfully', 'invitations/invitation-lists', 'put', '','responseText');
		}
		else{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, 'Invitation declined successfully', 'invitations/invitation-lists', 'put', '','responseText');
		}
		
	};
	
	getInviteSubmitData(invitationId: any, status_value: any) {
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2200
		});
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?invitationId="+invitationId;
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.getSubmitData = JSON.parse(Response.toString());
				this.case_id = this.getSubmitData.caseId;
				this.patient_id = this.getSubmitData.patient_id;
				this.patient_name = this.getSubmitData.patientName;
				this.invitation_id = this.getSubmitData.invitationId;
				this.invited_user_mail = this.getSubmitData.invitedUserMail;
				this.invited_user_id = this.getSubmitData.invitedUserId;
				this.statusvalue = status_value;
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
	
	onSubmit(form: NgForm) {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		if(form.value.dateFrom != '')
		{
			url += "?dateFrom="+Date.parse(form.value.dateFrom);
		}
		if(form.value.dateTo != '')
		{
			if(form.value.dateFrom != '')
			{
				url += "&dateTo="+Date.parse(form.value.dateTo);
			}
			else
			{
				url += "?dateTo="+Date.parse(form.value.dateTo);
			}
		}
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.invitedata = Array();
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
					  dateCreated: GetAllData[k].dateCreated,
					  resourceOwner: GetAllData[k].resourceOwner,
					  dentalId: user.dentalId,
					  caseTitle: ''
					});
					this.getuserdetailsall(GetAllData[k].resourceOwner,k);
					this.getcasedetails(GetAllData[k].caseId,k);
				}
			}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
	};
	
	getInviteListingReceived() {
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2500
		});
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?invitedUserId="+user.dentalId;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				//alert(JSON.stringify(GetAllData));
				GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.inviteReceivedData = Array();
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.inviteReceivedData.push({
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
					  dateCreated: GetAllData[k].dateCreated,
					  resourceOwner: GetAllData[k].resourceOwner,
					  dentalId: user.dentalId,
					  caseTitle: ''
					});
					this.getuserdetailsallRecvd(GetAllData[k].resourceOwner,k);
					this.getcasedetailsRecvd(GetAllData[k].caseId,k);
				}
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
	
	getcasedetailsRecvd(caseId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let caseData = JSON.parse(Response.toString());
				this.inviteReceivedData[index].caseTitle = caseData.title;
				//alert(JSON.stringify(this.inviteReceivedData));
			}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	getuserdetailsallRecvd(userId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?dentalId="+userId;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			this.inviteReceivedData[index].userName = name;
			//alert(JSON.stringify(this.inviteReceivedData));
		}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
}
