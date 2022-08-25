import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-case-list',
  templateUrl: './patient-case-list.component.html',
  styleUrls: ['./patient-case-list.component.css']
})
export class PatientCaseListComponent implements OnInit {

  casedata:any;
  dtOptions: DataTables.Settings = {};
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router) { }

  ngOnInit(): void {
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
      },
    };
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	viewCase(caseId: any) {
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['master/master-list']);
	}
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let patientId = sessionStorage.getItem("patientId");
			let url = this.utility.apiData.userCases.ApiUrl;
			if(patientId != '')
			{
				url += "?patientId="+patientId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let AllDate = JSON.parse(Response.toString());
					let caseDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
					this.casedata = caseDate.reverse();
					//this.casedata = casedataResult.slice(0, 5);
					//alert(JSON.stringify(this.casedata));
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
}
