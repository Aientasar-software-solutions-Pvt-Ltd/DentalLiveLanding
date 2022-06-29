import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as $ from "jquery";

@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.css']
})
export class ReferralDetailsComponent implements OnInit {
show = false;
show1 = false;
	id:any = "tab1";
	tabContent(ids:any){
		this.id = ids;
	}
  dtOptions: DataTables.Settings = {};
  constructor(private location: Location) { }
  
  back(): void {
    this.location.back()
  }
  
  ngOnInit(): void {
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
	$('a[data-bs-toggle="tab"]').on('click', function(e:any){
		var target = $(e.target).attr("href"); // activated tab
		$($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
	});

  }
  
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}

}
