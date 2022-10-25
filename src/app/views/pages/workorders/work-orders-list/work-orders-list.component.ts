//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-orders-list',
  templateUrl: './work-orders-list.component.html',
  styleUrls: ['./work-orders-list.component.css']
})
export class WorkOrdersListComponent implements OnInit {
	isLoadingData = true;
	masterSelected:boolean;
	tabledata:any;
	checkedList:any;
	shimmer = Array;
	userDeatils: any;
	getAllMember: any;
	isCount =0;
	dtOptions: DataTables.Settings = {};
	
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }

	ngOnInit(): void {
		this.userDeatils = this.usr.getUserDetails(false);
		sessionStorage.setItem('checkCase', '');
		sessionStorage.setItem('caseId', '');
		sessionStorage.removeItem("workorderTabActive");
		sessionStorage.setItem('backurl', '/workorders/work-orders');
		this.getallworkorder();
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
	
	getallworkorder() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userWorkOrders.ApiUrl;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					
					this.getAllMember = JSON.parse(Response.toString());
					this.getAllMember.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					this.tabledata = Array();
					if(this.getAllMember.length == '0')
					{
						//swal.close();
						this.isLoadingData = false;
					}
					for(var k = 0; k < this.getAllMember.length; k++)
					{
						this.tabledata.push({
						  id: k,
						  resourceOwner: this.getAllMember[k].resourceOwner,
						  dateCreated: this.getAllMember[k].dateCreated,
						  presentStatus: this.getAllMember[k].presentStatus,
						  startdate: this.getAllMember[k].startdate,
						  workorderId: this.getAllMember[k].workorderId,
						  patientName: this.getAllMember[k].patientName,
						  caseId: this.getAllMember[k].caseId,
						  patientId: this.getAllMember[k].patientId,
						  toothguide: this.getAllMember[k].toothguide,
						  enddate: this.getAllMember[k].enddate,
						  notes: this.getAllMember[k].notes,
						  dateUpdated: this.getAllMember[k].dateUpdated,
						  milestoneId: this.getAllMember[k].milestoneId,
						  title: this.getAllMember[k].title,
						  caseTitle: '',
						  memberName: '',
						});
						this.getcasedetails(this.getAllMember[k].caseId,this.getAllMember[k].members,k);
					}
					this.tabledata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					
				}
			}, (error) => {
				if (error.status === 404)
				swal('No workorder found');
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
	getcasedetails(caseId, member, index) {
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
				this.getuserdetailsall(member,index).then(
				(value) => {
					if(this.getAllMember.length == this.isCount)
					{
						this.isLoadingData = false;
					}
				},
				(error) => {
					if(this.getAllMember.length == this.isCount)
					{
						this.isLoadingData = false;
					}
				});
			}
			}, (error) => {
				this.getuserdetailsall(member,index);
				if (error.status === 404)
				swal('No workorder found');
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
		let url = this.utility.apiData.userWorkOrders.ApiUrl;
		if(form.value.workorder_title != '' && form.value.workorder_title != null)
		{
			url += "?title="+form.value.workorder_title;
		}
		if(form.value.dateFrom != '' && form.value.dateFrom != null)
		{
			if(form.value.workorder_title != '' && form.value.workorder_title != null)
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
			
			if((form.value.dateFrom != '' && form.value.dateFrom != null) || (form.value.workorder_title != '' && form.value.workorder_title != null))
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
				this.getAllMember = JSON.parse(Response.toString());
				this.getAllMember.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.tabledata = Array();
				if(this.getAllMember.length == '0')
				{
					//swal.close();
					this.isLoadingData = false;
				}
				for(var k = 0; k < this.getAllMember.length; k++)
				{
					this.tabledata.push({
					  id: k,
					  resourceOwner: this.getAllMember[k].resourceOwner,
					  dateCreated: this.getAllMember[k].dateCreated,
					  presentStatus: this.getAllMember[k].presentStatus,
					  startdate: this.getAllMember[k].startdate,
					  workorderId: this.getAllMember[k].workorderId,
					  patientName: this.getAllMember[k].patientName,
					  caseId: this.getAllMember[k].caseId,
					  patientId: this.getAllMember[k].patientId,
					  toothguide: this.getAllMember[k].toothguide,
					  enddate: this.getAllMember[k].enddate,
					  notes: this.getAllMember[k].notes,
					  dateUpdated: this.getAllMember[k].dateUpdated,
					  milestoneId: this.getAllMember[k].milestoneId,
					  title: this.getAllMember[k].title,
					  caseTitle: '',
					  memberName: '',
					});
					this.getcasedetails(this.getAllMember[k].caseId,this.getAllMember[k].members,k);
				}
				this.tabledata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				form.resetForm(); // or form.reset();
			}
		}, (error) => {
			form.resetForm(); // or form.reset();
			if (error.status === 404)
			swal('No workorder found');
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
						}
					}
					}, (error) => {
						Resolve(true);
						this.isLoadingData = false;
						if (error.status === 404)
						swal('No workorder found');
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
