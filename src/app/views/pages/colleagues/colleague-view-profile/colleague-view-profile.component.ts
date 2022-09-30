//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-colleague-view-profile',
  templateUrl: './colleague-view-profile.component.html',
  styleUrls: ['./colleague-view-profile.component.css']
})
export class ColleagueViewProfileComponent implements OnInit {

	isLoadingData = true;
	public jsonObj = {
	  colleagueId: ''
	}
	dtOptions: DataTables.Settings = {};
	masterSelected:boolean;
	detailsdata:any;
	colleaguedata:any;
	invitedata: any;
	inviteReceivedData: any;
	shimmer = Array;
	
	
	profileId: any;
	caseId: any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private route: ActivatedRoute) {
	this.masterSelected = false; 
	this.profileId = this.route.snapshot.paramMap.get('profileId');
	this.caseId = this.route.snapshot.paramMap.get('caseId');
	}
	
	back(): void {
		this.location.back()
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
		  },
		   
		};
		$('a[data-bs-toggle="tab"]').on('click', function(e:any){
			var target = $(e.target).attr("href"); // activated tab
			$($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
		});
		this.getColleagueDetails();
		this.getCaseDetail();
	}
  
	getColleagueDetails() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{

			let user = this.usr.getUserDetails(false);
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			url += "?resourceOwner="+user.emailAddress;
			var colleagueId = this.profileId;
			url += "&invitedUserId="+colleagueId;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					this.isLoadingData = false;
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
			this.invitedata[index].userEducation = userData[0].education;
			this.invitedata[index].userCity = userData[0].city;
			this.invitedata[index].userCountry = userData[0].country;
			if((userData[0].imageSrc != undefined) && (userData[0].imageSrc != '') && (userData[0].imageSrc != null))
			{
				this.invitedata[index].imageSrc = 'https://dentallive-accounts.s3-us-west-2.amazonaws.com/'+userData[0].imageSrc;
			}
			else
			{
				this.invitedata[index].imageSrc = "assets/images/users.png";
			}
		}
		}, (error) => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
			}
			}, (error) => {
				if (error.status === 404)
				swal('No patient found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered for first name or last name');
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
  
	getCaseDetail() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			
			let caseId = this.caseId;
			
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					this.isLoadingData = false;
					this.detailsdata = JSON.parse(Response.toString());
				}
			}, (error) => {
				if (error.status === 404)
				swal('No patient found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered for first name or last name');
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
