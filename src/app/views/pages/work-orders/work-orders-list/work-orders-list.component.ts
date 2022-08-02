//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
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

	masterSelected:boolean;
	tabledata:any;
	checkedList:any;
	
	dtOptions: DataTables.Settings = {};
	
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }

	ngOnInit(): void {
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
			var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
			swal.fire({
				html: sweet_loader,
				icon: "https://www.boasnotas.com/img/loading2.gif",
				showConfirmButton: false,
				allowOutsideClick: false,     
				closeOnClickOutside: false,
				timer: 2200,
				//icon: "success"
			});
			let url = this.utility.apiData.userWorkOrders.ApiUrl;
			//let caseId = sessionStorage.getItem("caseId");
			//if(caseId != '')
			//{
				//url += "?caseId="+caseId;
			//}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					//alert(JSON.stringify(this.tabledata));
					//alert(this.tabledata['0'].title);
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	editWorkOrders(workorderId: any) {
		sessionStorage.setItem('workorderId', workorderId);
		this.router.navigate(['work-orders/work-order-edit']);
	}
	
	viewWorkorders(workorderId: any) {
		sessionStorage.setItem('workorderId', workorderId);
		this.router.navigate(['work-orders/work-order-details']);
	}
	
	onSubmit(form: NgForm) {
		
		let url = this.utility.apiData.userWorkOrders.ApiUrl;
		if(form.value.dateFrom != '')
		{
			url += "?dateFrom="+Date.parse(form.value.dateFrom);
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
				this.tabledata = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.tabledata));
				//alert(this.tabledata['0'].title);
			}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
	};
}
