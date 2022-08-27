//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {

  masterSelected:boolean;
  tabledata:any;
  checkedList:any;
	public loading = false;
	id:any = "myPatients";
	tabContent(ids:any){
		this.id = ids;
	}
	
	dtOptions: DataTables.Settings = {};
  constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { 
	this.masterSelected = false;
  }

  ngOnInit(): void {
	this.getallpatiant();
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
	  /*columnDefs: [
			{ orderable: false, targets: 0 },
			{ orderable: false, targets: 5 },
		]*/
	};
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}

	getallpatiant() {
		this.tabledata = '';
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2200
		});
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userPatients.ApiUrl;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let AllDate = JSON.parse(Response.toString());
				
				let patientDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
				//alert(JSON.stringify(patientDate));
				this.tabledata = patientDate.reverse();
				//alert(JSON.stringify(this.tabledata[0].isActive));
			}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
	editpatiant(patientId: any) {
		//sessionStorage.setItem('patientId', patientId);
		this.router.navigate(['/patients/patient-edit/'+patientId]);
	}
	viewpatiant(patientId: any) {
		//sessionStorage.setItem('patientId', patientId);
		this.router.navigate(['patients/patient-details/'+patientId]);
	}
	deletepatiant(patientId: any) {
		let url = this.utility.apiData.userPatients.ApiUrl;
		this.dataService.deletePatientData(url, patientId).subscribe(Response => {
			swal.fire("Patient deleted successfully");
			this.getallpatiant();
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
	}
	onSubmit(form: NgForm) {
		let url = this.utility.apiData.userPatients.ApiUrl;
		let strName = form.value.firstName;
		let patiantName =strName.split(' ');
		if(patiantName[0] != '')
		{
			url += "?firstName="+patiantName[0];
		}
		if(patiantName.length > 1)
		{
			if(patiantName[1] != '')
			{
				if(patiantName[0] != '')
				{
					url += "&lastName="+patiantName[1];
				}
				else
				{
					url += "?lastName="+patiantName[1];
				}
			}
		}
		if(form.value.dateFrom != '')
		{
			if(patiantName[0] != '' || (patiantName.length > 1))
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
			if(patiantName[0] != '' || form.value.dateFrom != '')
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
					let AllDate = JSON.parse(Response.toString());
				
					let patientDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
					//alert(JSON.stringify(sortedCountries));
					this.tabledata = patientDate.reverse();
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
	
  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.tabledata.length; i++) {
      this.tabledata[i].isSelected = this.masterSelected;
    }
    //this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.tabledata.every(function(item:any) {
        return item.isSelected == true;
      })
    //this.getCheckedItemList();
  }

  // Get List of Checked Items
  /*getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
      this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }*/

}
