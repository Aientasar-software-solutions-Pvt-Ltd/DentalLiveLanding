//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';	
import { NgForm } from '@angular/forms';								
import { CalendarOptions } from '@fullcalendar/angular'; 
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-invitation-lists',
  templateUrl: './invitation-lists.component.html',
  styleUrls: ['./invitation-lists.component.css']
})
export class InvitationListsComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	isLoadingData = true;
	id:any = "Received";
	shimmer = Array;
	tabContent(ids:any){
		this.id = ids;
	}
	
  dtOptions: DataTables.Settings = {};
  
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev) { }
  
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
	
	/*confirmBox(){
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
	}*/
	
	getInviteListing() {
		/* swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		}); */
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?resourceOwner="+user.emailAddress;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				//alert(JSON.stringify(GetAllData));
				GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.invitedata = Array();
				if(GetAllData.length == '0')
				{
					//swal.close();
					this.isLoadingData = false;
				}
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
					this.getcasedetails(GetAllData[k].caseId,k);
					this.getuserdetailsall(GetAllData[k].invitedUserId,k);
				}
			}
		}, error => {
			if (error.status === 404)
			swal('No invitation found');
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
				this.inviteReceivedData[index].caseTitle = caseData.title;
				//alert(JSON.stringify(this.invitedata));
			}
			}, (error) => {
				if (error.status === 404)
				swal('No invitation found');
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
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			this.invitedata[index].userName = name;
			//this.inviteReceivedData[index].userName = name;
			//alert(JSON.stringify(this.inviteReceivedData));
			swal.close();
		}
		}, (error) => {
			if (error.status === 404)
			swal('No invitation found');
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
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, 'Invitation accepted successfully', 'invitations/invitation-lists', 'put', '','responseText',1);
		}
		else{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, 'Invitation declined successfully', 'invitations/invitation-lists', 'put', '','responseText',1);
		}
		
	};
	
	getInviteSubmitData(invitationId: any, status_value: any) {
		/* swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		}); */
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?invitationId="+invitationId;
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				//swal.close();
				this.isLoadingData = false;
				this.getSubmitData = JSON.parse(Response.toString());
				this.case_id = this.getSubmitData.caseId;
				this.patient_id = this.getSubmitData.patientId;
				this.patient_name = this.getSubmitData.patientName;
				this.invitation_id = this.getSubmitData.invitationId;
				this.invited_user_mail = this.getSubmitData.invitedUserMail;
				this.invited_user_id = this.getSubmitData.invitedUserId;
				this.statusvalue = status_value;
			}
		}, error => {
			if (error.status === 404)
			swal('No invitation found');
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
	
	getInviteListingReceived() {
		/* swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		}); */
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?invitedUserMail="+user.emailAddress;
		//alert(url);
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				//alert(JSON.stringify(GetAllData));
				GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.inviteReceivedData = Array();
				this.isLoadingData = false;
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
				//alert(JSON.stringify(this.inviteReceivedData));
			}
		}, error => {
			if (error.status === 404)
			swal('No invitation found');
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
				if (error.status === 404)
				swal('No invitation found');
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
	
	getuserdetailsallRecvd(userId, index) {
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
			let name = userData.accountfirstName+' '+userData.accountlastName;
			this.inviteReceivedData[index].userName = name;
		}
		}, (error) => {
			if (error.status === 404)
			swal('No invitation found');
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
}