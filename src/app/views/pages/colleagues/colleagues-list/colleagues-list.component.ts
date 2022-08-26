//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-colleagues-list',
  templateUrl: './colleagues-list.component.html',
  styleUrls: ['./colleagues-list.component.css']
})
export class ColleaguesListComponent implements OnInit {

	dtOptions: DataTables.Settings = {};
	masterSelected:boolean;
	colleaguedata:any;
	invitedata: any;
	
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }

	ngOnInit(): void {
		this.getInviteListing();
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
	}
	
	getInviteListing() {
		var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
		swal.fire({
			html: sweet_loader,
			showConfirmButton: false,
			allowOutsideClick: false, 
			timer: 2200
		});
		
		let user = this.usr.getUserDetails(false);
		//alert(user.dentalId);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?resourceOwner="+user.dentalId;
		url += "&presentStatus=1";
		
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				//alert(JSON.stringify(Response.toString()));
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
	viewColleagueDetails(colleagueId: any,caseId: any) {
		//alert(caseId);
		sessionStorage.setItem('colleagueId', colleagueId);
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['colleagues/colleague-view-profile']);
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
		}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
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
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	onSubmitColleague(form: NgForm) {
		alert(111111);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		let user = this.usr.getUserDetails(false);
		url += "?resourceOwner="+user.dentalId;
		//url += "&presentStatus=1";
		
		if(form.value.dateFrom != '')
		{
			url += "&dateFrom="+Date.parse(form.value.dateFrom);
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
		//alert(url);
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				//alert(JSON.stringify(Response.toString()));
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
	};
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
}
