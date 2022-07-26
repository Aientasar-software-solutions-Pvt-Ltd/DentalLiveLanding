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
					this.tabledata = JSON.parse(Response.toString()).reverse();
					//alert(JSON.stringify(this.tabledata));
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	viewCase(caseId: any) {
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['master']);
	}
}
