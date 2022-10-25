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
	GetAllData: any;
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
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	getInviteListing() {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?resourceOwner="+user.emailAddress;
		url += "&presentStatus=1";
		
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				this.GetAllData = JSON.parse(Response.toString());
				this.GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				//alert(JSON.stringify(this.GetAllData));
				this.invitedata = Array();
				let Row = 0;
				if(this.GetAllData.length == '0')
				{
					this.isLoadingData = false;
				}
				for(var k = 0; k < this.GetAllData.length; k++)
				{
					if(this.GetAllData[k].presentStatus == 1)
					{
						this.invitedata.push({
						  id: Row,
						  patientId: this.GetAllData[k].patientId,
						  invitedUserId: this.GetAllData[k].invitedUserId,
						  invitedUserMail: this.GetAllData[k].invitedUserMail,
						  invitationId: this.GetAllData[k].invitationId,
						  userName: '',
						  presentStatus: this.GetAllData[k].presentStatus,
						  invitationText: this.GetAllData[k].invitationText,
						  patientName: this.GetAllData[k].patientName,
						  caseId: this.GetAllData[k].caseId,
						  dateUpdated: this.GetAllData[k].dateUpdated,
						  dateCreated: this.GetAllData[k].dateCreated,
						  resourceOwner: this.GetAllData[k].resourceOwner,
						  dentalId: user.dentalId,
						  caseTitle: ''
						});
						this.getcasedetails(this.GetAllData[k].invitedUserMail, this.GetAllData[k].caseId, Row);
						Row++;
					}
				}
				//alert(JSON.stringify(this.invitedata));
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
			url += "?emailAddress="+userId;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let name = userData.accountfirstName+' '+userData.accountlastName;
			this.invitedata[index].userName = name;
			this.invitedata[index].userEducation = userData.education;
			this.invitedata[index].userCity = userData.city;
			this.invitedata[index].userCountry = userData.country;
			
			if(this.GetAllData.length == (index+1))
			{
				this.isLoadingData = false;
			}
		}
		//alert(JSON.stringify(this.invitedata));
		}, (error) => {
			this.isLoadingData = false;
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
	getcasedetails(userId, caseId, index) {
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
				this.getuserdetailsall(userId, index);
			}
			}, (error) => {
				this.getuserdetailsall(userId, index);
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
		this.isLoadingData = true;
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		let user = this.usr.getUserDetails(false);
		url += "?resourceOwner="+user.emailAddress;
		url += "&presentStatus=1";
		
		if(form.value.dateFrom != '' && form.value.dateFrom != null)
		{
			url += "&dateFrom="+Date.parse(form.value.dateFrom);
		}
		if(form.value.dateTo != '')
		{
			const mydate=form.value.dateTo;
			const newDate = new Date(mydate);
			const result = new Date(newDate.setDate(newDate.getDate() + 1));
			if(form.value.dateFrom != '' && form.value.dateFrom != null)
			{
				url += "&dateTo="+Date.parse(result);
			}
			else
			{
				url += "?dateTo="+Date.parse(result);
			}
		}
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				this.GetAllData = JSON.parse(Response.toString());
				this.GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				//alert(JSON.stringify(this.GetAllData));
				this.invitedata = Array();
				let Row = 0;
				if(this.GetAllData.length == '0')
				{
					this.isLoadingData = false;
				}
				for(var k = 0; k < this.GetAllData.length; k++)
				{
					if(this.GetAllData[k].presentStatus == 1)
					{
						this.invitedata.push({
						  id: Row,
						  patientId: this.GetAllData[k].patientId,
						  invitedUserId: this.GetAllData[k].invitedUserId,
						  invitedUserMail: this.GetAllData[k].invitedUserMail,
						  invitationId: this.GetAllData[k].invitationId,
						  userName: '',
						  presentStatus: this.GetAllData[k].presentStatus,
						  invitationText: this.GetAllData[k].invitationText,
						  patientName: this.GetAllData[k].patientName,
						  caseId: this.GetAllData[k].caseId,
						  dateUpdated: this.GetAllData[k].dateUpdated,
						  dateCreated: this.GetAllData[k].dateCreated,
						  resourceOwner: this.GetAllData[k].resourceOwner,
						  dentalId: user.dentalId,
						  caseTitle: ''
						});
						this.getcasedetails(this.GetAllData[k].invitedUserMail, this.GetAllData[k].caseId, Row);
						Row++;
					}
				}
				form.resetForm(); // or form.reset();
			}
		}, error => {
			form.resetForm(); // or form.reset();
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
}