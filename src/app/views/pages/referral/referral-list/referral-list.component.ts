//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-referral-list',
  templateUrl: './referral-list.component.html',
  styleUrls: ['./referral-list.component.css']
})
export class ReferralListComponent implements OnInit {
	isLoadingData = true;
	masterSelected:boolean;
	tabledata:any;
	detailsdata:any;
	checkedList:any;
	shimmer = Array;
	dtOptions: DataTables.Settings = {};
	
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }


	ngOnInit(): void {
		sessionStorage.setItem('checkCase', '');
		sessionStorage.setItem('caseId', '');
		sessionStorage.setItem('checkmilestoneidref', '');
		sessionStorage.setItem('backurl', '/referrals/referral-list');
		this.getallreferrals();
		this.getCaseDetails();
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
	}
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	getallreferrals() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userReferrals.ApiUrl;
			
			let caseId = sessionStorage.getItem("caseId");
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					
					let GetAllData = JSON.parse(Response.toString());
					GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					if(GetAllData.length == '0')
					{
						this.isLoadingData = false;
					}
					this.tabledata = Array();
					for(var k = 0; k < GetAllData.length; k++)
					{
						this.tabledata.push({
						  id: k,
						  dateCreated: GetAllData[k].dateCreated,
						  presentStatus: GetAllData[k].presentStatus,
						  startdate: GetAllData[k].startdate,
						  referralId: GetAllData[k].referralId,
						  patientName: '',
						  caseId: GetAllData[k].caseId,
						  patientId: GetAllData[k].patientId,
						  toothguide: GetAllData[k].toothguide,
						  enddate: GetAllData[k].enddate,
						  notes: GetAllData[k].notes,
						  dateUpdated: GetAllData[k].dateUpdated,
						  milestoneId: GetAllData[k].milestoneId,
						  title: GetAllData[k].title,
						  caseTitle: '',
						  memberName: ''
						});
						this.getcasedtls(GetAllData[k].caseId,k);
						this.getuserdetailsall(GetAllData[k].members,k);
					}
					this.tabledata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					
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
	
	getcasedtls(caseId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let caseData = JSON.parse(Response.toString());
				this.tabledata[index].caseTitle = caseData.title;
				this.tabledata[index].patientName = caseData.patientName;
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
	getCaseDetails() {
		this.detailsdata = '';
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			
			let caseId = sessionStorage.getItem("caseId");
			
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.detailsdata = JSON.parse(Response.toString());
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
	
	onSubmit(form: NgForm) {
		
		let url = this.utility.apiData.userReferrals.ApiUrl;
		if(form.value.dateFrom != '')
		{
			url += "?startdate="+Date.parse(form.value.dateFrom);
		}
		if(form.value.dateTo != '')
		{
			if(form.value.dateFrom != '')
			{
				url += "&enddate="+Date.parse(form.value.dateTo);
			}
			else
			{
				url += "?enddate="+Date.parse(form.value.dateTo);
			}
		}
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
				this.tabledata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)
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
	};
	
	
	getuserdetailsall(userId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let memberResult = '';
			for(var j = 0; j < userId.length; j++)
			{
				let url = this.utility.apiData.userColleague.ApiUrl;
				if(userId != '')
				{
					url += "?dentalId="+userId[j];
				}
				this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					
					let userData = JSON.parse(Response.toString());
					if(userData.length > 0)
					{
						let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
						if(memberResult)
						{
							memberResult += ','+name;
						}
						else{
							memberResult += name;
						}
						if(j == userId.length)
						{
							this.tabledata[index].memberName = memberResult;
						}
						//swal.close();
						this.isLoadingData = false;
					}
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
	}
}