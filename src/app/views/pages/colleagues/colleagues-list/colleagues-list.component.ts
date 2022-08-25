//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
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

	dtOptions: DataTables.Settings = {};
	masterSelected:boolean;
	colleaguedata:any;
	
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }

	ngOnInit(): void {
		this.getColleagueListing();
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
	getColleagueListing() {
		
		var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
		swal.fire({
			html: sweet_loader,
			showConfirmButton: false,
			allowOutsideClick: false, 
			timer: 2200
		});
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
			swal.fire({
				html: sweet_loader,
				showConfirmButton: false,
				allowOutsideClick: false,
				timer: 2200
			});
			let url = this.utility.apiData.userColleague.ApiUrl;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.colleaguedata = JSON.parse(Response.toString()).reverse();
					
					//alert(JSON.stringify(this.colleaguedata));
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}

}
