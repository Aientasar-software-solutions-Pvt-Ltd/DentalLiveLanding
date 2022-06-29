import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-case-invitation-list',
  templateUrl: './case-invitation-list.component.html',
  styleUrls: ['./case-invitation-list.component.css']
})
export class CaseInvitationListComponent implements OnInit {

	
	  
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
      }
    };
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	confirmArchive(){
		Swal.fire({
		  title: 'Are you sure want to archive?',
		  text: 'You will not be able to undo this file!',
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#0070D2',
		  cancelButtonColor: '#F7517F',
		  confirmButtonText: 'Yes, archive it!',
		  cancelButtonText: 'No, keep it'
		}).then((result) => {
		  if (result.value) {
			Swal.fire(
			  'Archived!',
			  'Your imaginary file has been archived.',
			  'success'
			)
		  } else if (result.dismiss === Swal.DismissReason.cancel) {
			Swal.fire(
			  'Cancelled',
			  'Your imaginary file is no change',
			  'error'
			)
		  }
		})
	}

}
