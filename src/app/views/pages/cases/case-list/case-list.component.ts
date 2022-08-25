//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
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

	masterSelected:boolean;
	tabledata:any;
	checkedList:any;
  
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

			swal.fire({
				title: 'Loading....',
				showConfirmButton: false,
				timer: 2200
			});
			let url = this.utility.apiData.userCases.ApiUrl;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let AllDate = JSON.parse(Response.toString());
					let caseDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
					//alert(JSON.stringify(sortedCountries));
					this.tabledata = caseDate.reverse();
					//alert(JSON.stringify(this.tabledata));
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	viewCase(caseId: any, patientId: any) {
		sessionStorage.setItem('caseId', caseId);
		sessionStorage.setItem('patientId', patientId);
		sessionStorage.setItem("masterTab", 'tab1');
		this.router.navigate(['master/master-list']);
	}
	onSubmit(form: NgForm) {
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
}
