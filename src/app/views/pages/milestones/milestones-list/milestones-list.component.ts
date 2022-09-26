//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-milestones-list',
  templateUrl: './milestones-list.component.html',
  styleUrls: ['./milestones-list.component.css']
})

export class MilestonesListComponent implements OnInit {
	isLoadingData = true;
	masterSelected:boolean;
	tabledata:any;
	checkedList:any;
	userEmailAddress:any;
	shimmer = Array;
	dtOptions: DataTables.Settings = {};
	
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }

	ngOnInit(): void {
		sessionStorage.setItem('checkCase', '');
		sessionStorage.setItem('caseId', '');
		this.getallmilestone();
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
	getallmilestone() {
		sessionStorage.setItem('backurl', '/milestones/milestones-list');
		this.tabledata = '';
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userMilestones.ApiUrl;
			let caseId = sessionStorage.getItem("caseId");
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					this.isLoadingData = false;
					this.tabledata = JSON.parse(Response.toString());
					this.tabledata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					this.userEmailAddress = user.emailAddress;
				}
			}, (error) => {
				if (error.status === 404)
				swal('No milestone found');
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
	
	viewmilestone(milestoneId: any) {
		this.router.navigate(['milestones/milestone-details/'+milestoneId]);
	}
	editMilestone(milestoneId: any) {
		this.router.navigate(['milestones/milestone-edit/'+milestoneId]);
	}
	
	deletemilestone(milestoneId: any) {
		let url = this.utility.apiData.userMilestones.ApiUrl;
		this.dataService.deleteDataRecord(url, milestoneId, 'milestoneId').subscribe(Response => {
			swal('Milestones deleted successfully');
			this.getallmilestone();
		}, (error) => {
			if (error.status === 404)
			swal('No milestone found');
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
	
	onSubmit(form: NgForm) {
		let url = this.utility.apiData.userMilestones.ApiUrl;
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
		if(form.value.patientId != '')
		{
			if(patientName != '' || form.value.patientId != '')
			{ 
				url += "&patientId="+Date.parse(form.value.patientId);
			}
			else
			{
				url += "?patientId="+Date.parse(form.value.patientId);
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
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString()).reverse();
				//alert(JSON.stringify(this.tabledata));
				//alert(this.tabledata['0'].title);
			}
		}, (error) => {
			if (error.status === 404)
			swal('No milestone found');
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
}
