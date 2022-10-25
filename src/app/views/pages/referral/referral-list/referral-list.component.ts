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
	userDeatils: any;
	GetAllData: any;
	isCount =0;
	dtOptions: DataTables.Settings = {};
	
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }


	ngOnInit(): void {
		sessionStorage.removeItem("referralTabActive");
		this.userDeatils = this.usr.getUserDetails(false);
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
					
					this.GetAllData = JSON.parse(Response.toString());
					this.GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					if(this.GetAllData.length == '0')
					{
						this.isLoadingData = false;
					}
					this.tabledata = Array();
					for(var k = 0; k < this.GetAllData.length; k++)
					{
						this.tabledata.push({
						  id: k,
						  resourceOwner: this.GetAllData[k].resourceOwner,
						  dateCreated: this.GetAllData[k].dateCreated,
						  presentStatus: this.GetAllData[k].presentStatus,
						  startdate: this.GetAllData[k].startdate,
						  referralId: this.GetAllData[k].referralId,
						  patientName: '',
						  caseId: this.GetAllData[k].caseId,
						  patientId: this.GetAllData[k].patientId,
						  toothguide: this.GetAllData[k].toothguide,
						  enddate: this.GetAllData[k].enddate,
						  notes: this.GetAllData[k].notes,
						  dateUpdated: this.GetAllData[k].dateUpdated,
						  milestoneId: this.GetAllData[k].milestoneId,
						  title: this.GetAllData[k].title,
						  caseTitle: '',
						  memberName: ''
						});
						this.getcasedtls(this.GetAllData[k].caseId, this.GetAllData[k].members, k);
						
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
	
	getcasedtls(caseId, members, index) {
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
				this.getuserdetailsall(members,index).then(
				(value) => {
					if(this.GetAllData.length == this.isCount)
					{
						this.isLoadingData = false;
					}
				},
				(error) => {
					if(this.GetAllData.length == this.isCount)
					{
						this.isLoadingData = false;
					}
				});
				
			}
			}, (error) => {
				this.getuserdetailsall(members,index).then(
				(value) => {
					if(this.GetAllData.length == (index+1))
					{
						this.isLoadingData = false;
					}
				},
				(error) => {
					if(this.GetAllData.length == (index+1))
					{
						this.isLoadingData = false;
					}
				});
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
		this.isCount = 0;
		this.isLoadingData = true;
		let url = this.utility.apiData.userReferrals.ApiUrl;
		if(form.value.referral_title != '' && form.value.referral_title != null)
		{
			url += "?title="+form.value.referral_title;
		}
		if(form.value.dateFrom != '' && form.value.dateFrom != null)
		{
			if(form.value.referral_title != '' && form.value.referral_title != null)
			{
				url += "&dateFrom="+Date.parse(form.value.dateFrom);
			}
			else
			{
				url += "?dateFrom="+Date.parse(form.value.dateFrom);
			}
		}
		if(form.value.dateTo != '' && form.value.dateTo != null)
		{
			const mydate=form.value.dateTo;
			const newDate = new Date(mydate);
			const result = new Date(newDate.setDate(newDate.getDate() + 1));

			if((form.value.dateFrom != '' && form.value.dateFrom != null) || (form.value.referral_title != '' && form.value.referral_title != null))
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
				if(this.GetAllData.length == '0')
				{
					this.isLoadingData = false;
				}
				this.tabledata = Array();
				for(var k = 0; k < this.GetAllData.length; k++)
				{
					this.tabledata.push({
					  id: k,
					  resourceOwner: this.GetAllData[k].resourceOwner,
					  dateCreated: this.GetAllData[k].dateCreated,
					  presentStatus: this.GetAllData[k].presentStatus,
					  startdate: this.GetAllData[k].startdate,
					  referralId: this.GetAllData[k].referralId,
					  patientName: '',
					  caseId: this.GetAllData[k].caseId,
					  patientId: this.GetAllData[k].patientId,
					  toothguide: this.GetAllData[k].toothguide,
					  enddate: this.GetAllData[k].enddate,
					  notes: this.GetAllData[k].notes,
					  dateUpdated: this.GetAllData[k].dateUpdated,
					  milestoneId: this.GetAllData[k].milestoneId,
					  title: this.GetAllData[k].title,
					  caseTitle: '',
					  memberName: ''
					});
					this.getcasedtls(this.GetAllData[k].caseId, this.GetAllData[k].members, k);
					
				}
				this.tabledata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				form.resetForm(); // or form.reset();
			}
		}, (error) => {
			form.resetForm(); // or form.reset();
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
		return new Promise((Resolve, myReject) => {
			let user = this.usr.getUserDetails(false);
			if(user)
			{
				let memberResult = '';
				let is_array = 0;
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
						is_array++;
						let userData = JSON.parse(Response.toString());
						if(userData.length > 0)
						{
							let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
							if(memberResult)
							{
								memberResult += ' , '+name;
							}
							else{
								memberResult += name;
							}
							if(is_array == userId.length)
							{
								this.tabledata[index].memberName = memberResult;
								this.isCount++;
								Resolve(true);
							}
							//swal.close();
						}
					}
					}, (error) => {
						Resolve(true);
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
		});
	}
}