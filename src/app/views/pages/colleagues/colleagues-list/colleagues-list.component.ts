//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
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
	isLoadingData = true;
	masterSelected:boolean;
	colleaguedata:any;
	invitedata: any;
	shimmer = Array;
	
	dtOptions: DataTables.Settings = {};
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
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?resourceOwner="+user.emailAddress;
		url += "&presentStatus=1";
		
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				//swal.close();
				this.isLoadingData = false;
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.invitedata = Array();
				let Row = 0;
				for(var k = 0; k < GetAllData.length; k++)
				{
					if(GetAllData[k].presentStatus == 1)
					{
						this.invitedata.push({
						  id: Row,
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
						this.getuserdetailsall(GetAllData[k].invitedUserId,Row);
						this.getcasedetails(GetAllData[k].caseId,Row);
						Row++;
					}
				}
			}
		}, error => {
			if (error.status === 404)
			swal('No colleagues found');
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
	viewColleagueDetails(colleagueId: any,caseId: any) {
		this.router.navigate(['colleagues/colleague-view-profile/'+colleagueId+'/'+caseId]);
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
			this.invitedata[index].userEducation = userData[0].education;
			this.invitedata[index].userCity = userData[0].city;
			this.invitedata[index].userCountry = userData[0].country;
		}
		}, (error) => {
			if (error.status === 404)
			swal('No colleagues found');
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
			}
			}, (error) => {
				if (error.status === 404)
				swal('No colleagues found');
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
	
	onSubmitColleague(form: NgForm) {
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		let user = this.usr.getUserDetails(false);
		url += "?resourceOwner="+user.dentalId;
		
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
			swal('No colleagues found');
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
	};
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
}
