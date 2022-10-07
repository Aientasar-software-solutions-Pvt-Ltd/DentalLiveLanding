//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent implements OnInit {

	isLoadingData = true;
	masterSelected:boolean;
	tabledata:any;
	allMember:any;
	colleaguesdata:any;
	shimmer = Array;
	public indexRow = 0;
	checkedList:any;
	invitedatas:any;
  
	id:any = "myCases";
	tabContent(ids:any){
		this.id = ids;
	}
	
	dtOptions: DataTables.Settings = {};
  constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }

  ngOnInit(): void {
  sessionStorage.setItem('checkPatient', '');
  sessionStorage.setItem('patientId', '');
	this.getallcase();
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
	
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					let AllDate = JSON.parse(Response.toString());
					
					if(AllDate == ''){ this.isLoadingData = false; }
					
					AllDate.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.tabledata = Array();
					var j = 0;
					var l = 0;
					for(var k = 0; k < AllDate.length; k++)
					{
						if(user.emailAddress == AllDate[k].resourceOwner)
						{
							this.tabledata.push({
							  id: j,
							  patientName: AllDate[k].patientName,
							  title: AllDate[k].title,
							  caseStatus: AllDate[k].caseStatus,
							  dateCreated: AllDate[k].dateCreated,
							  memberName: '',
							  patientId: AllDate[k].patientId,
							  caseId: AllDate[k].caseId
							});
							this.getCaseMemberList(AllDate[k].caseId,j,1);
							j++;
						}
						if((k+1) == AllDate.length)
						{
						this.isLoadingData = false;
						}
					}
					this.getAllMembers();
					
				}
			}, (error) => {
				if (error.status === 404)
				swal('No case found');
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
		if(this.id == 'myCases')
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			let patientName = form.value.patientName;
			if(patientName != '')
			{
				url += "?patientName="+patientName;
			}
			if(form.value.title != '')
			{
				if(patientName != '')
				{ 
					url += "&title="+form.value.title;
				}
				else
				{
					url += "?title="+form.value.title;
				}
			}
			if(form.value.dateFrom != '')
			{
				if(patientName != '' || form.value.title != '')
				{ 
					url += "&dateFrom="+Date.parse(form.value.dateFrom);
				}
				else
				{
					url += "?dateFrom="+Date.parse(form.value.dateFrom);
				}
			}
			if(form.value.dateTo != '')
			{
				if(patientName != '' || form.value.dateFrom != '' || form.value.title != '')
				{
					url += "&dateTo="+Date.parse(form.value.dateTo);
				}
				else
				{
					url += "?dateTo="+Date.parse(form.value.dateTo);
				}
			}
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString()).reverse();
				}
			}, error => {
				if (error.status === 404)
				swal('No case found');
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
		else
		{
			let user = this.usr.getUserDetails(false);
			if(user)
			{
				this.colleaguesdata = Array();	
				let mn = 0;
				for(var k=0; k < this.allMember.length; k++)
				{
					let url1 = this.utility.apiData.userCases.ApiUrl;
					url1 += "?caseId="+this.allMember[k].caseId;
					let patientName = form.value.patientName;
					if(patientName != '')
					{
						url1 += "&patientName="+patientName;
					}
					if(form.value.title != '')
					{
						url1 += "&title="+form.value.title;
					}
					if(form.value.dateFrom != '')
					{
						url1 += "&dateFrom="+Date.parse(form.value.dateFrom);
					}
					if(form.value.dateTo != '')
					{
						url1 += "&dateTo="+Date.parse(form.value.dateTo);
					}
					this.dataService.getallData(url1, true).subscribe(Response => {
						if (Response)
						{
							let AllDate = JSON.parse(Response.toString());
							this.colleaguesdata.push({
							  patientName: AllDate.patientName,
							  title: AllDate.title,
							  caseStatus: AllDate.caseStatus,
							  dateCreated: AllDate.dateCreated,
							  memberName: '',
							  patientId: AllDate.patientId,
							  caseId: AllDate.caseId
							});
							this.getCaseMemberList(AllDate.caseId,mn,2);
							mn++;
						}
					}, (error) => {
						if (error.status === 404)
						swal('No case found');
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
	};
	  
	getCaseMemberList(caseId, index, type) {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		if(type == 1)
		{
		url += "&resourceOwner="+user.emailAddress;
		}
		url += "&presentStatus=1";
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				this.invitedatas = Array();
				this.indexRow = 0;
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedatas.push({
					  id: this.indexRow,
					  userName: ''
					});
					this.getuserdetailsall(GetAllData[k].invitedUserMail,this.indexRow,index,type);
					this.indexRow++;
				} 
			}
		}, error => {
			if (error.status === 404)
			swal('No case found');
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
	
	getuserdetailsall(userId, index, Row,type) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?emailAddress="+userId;
		}
		let GetArray = this.invitedatas;
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			//swal.close();
			let userData = JSON.parse(Response.toString());
			let name = userData.accountfirstName+' '+userData.accountlastName;
			GetArray[index].userName = name;
			if((index+1) == GetArray.length)
			{
				if(type == 1)
				{
				this.tabledata[Row].memberName = GetArray;
				}
				else
				{
				this.colleaguesdata[Row].memberName = GetArray;
				}
			}
		}
		}, (error) => {
			if (error.status === 404)
			swal('No case found');
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
	
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			
			url += "?invitedUserMail="+user.emailAddress;
			url += "&presentStatus=1";
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.allMember = JSON.parse(Response.toString());
					this.allMember.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.getColleaguesCase();
				}
			}, error => {
				if (error.status === 404)
				swal('No case found');
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
	
	getColleaguesCase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			this.colleaguesdata = Array();	
			let mn = 0;
			for(var k=0; k < this.allMember.length; k++)
			{
				let url1 = this.utility.apiData.userCases.ApiUrl;
				url1 += "?caseId="+this.allMember[k].caseId;
				this.dataService.getallData(url1, true).subscribe(Response => {
					if (Response)
					{
						let AllDate = JSON.parse(Response.toString());
						this.colleaguesdata.push({
						  patientName: AllDate.patientName,
						  title: AllDate.title,
						  caseStatus: AllDate.caseStatus,
						  dateCreated: AllDate.dateCreated,
						  memberName: '',
						  patientId: AllDate.patientId,
						  caseId: AllDate.caseId
						});
						this.getCaseMemberList(AllDate.caseId,mn,2);
						mn++;
					}
				}, (error) => {
					if (error.status === 404)
					swal('No case found');
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