//@ts-nocheck
import { Component, OnInit } from '@angular/core';
//import swal from 'sweetalert2';
import swal from "sweetalert";
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import "@lottiefiles/lottie-player";

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  isLoadingData = true;
  masterSelected:boolean;
  tabledata:any;
  colleaguesData:any;
  shimmer = Array;
  allMember:any;
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
	//this.getAllMembers();
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
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userPatients.ApiUrl;
		//url += "?resourceOwner="+user.emailAddress;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let AllDate = JSON.parse(Response.toString());
				
				let patientDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
				this.colleaguesData = Array();	
				this.tabledata = Array();	
				//alert(JSON.stringify(patientDate));
				for(var k=0; k < patientDate.length; k++)
				{
					//if(patientDate[k].resourceOwner)
					//{
						if(user.emailAddress == patientDate[k].resourceOwner)
						{
							this.tabledata.push({
							  resourceOwner: patientDate[k].resourceOwner,
							  firstName: patientDate[k].firstName,
							  lastName: patientDate[k].lastName,
							  dob: patientDate[k].dob,
							  email: patientDate[k].email,
							  isActive: patientDate[k].isActive,
							  dateCreated: patientDate[k].dateCreated,
							  patientId: patientDate[k].patientId
							});
						}
						else
						{
							this.colleaguesData.push({
							  resourceOwner: patientDate[k].email,
							  firstName: patientDate[k].firstName,
							  lastName: patientDate[k].lastName,
							  dob: patientDate[k].dob,
							  email: patientDate[k].email,
							  isActive: patientDate[k].isActive,
							  dateCreated: patientDate[k].dateCreated,
							  patientId: patientDate[k].patientId
							});
						}
					//}
				}
				this.tabledata = this.tabledata.reverse();
				this.colleaguesData = this.colleaguesData.reverse();
				this.isLoadingData = false;
			}
		}, (error) => {
			swal({
				title: 'Unable to fetch data, please try again'
			});
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
			swal({
				title: 'Patient deleted successfully'
			});
			this.getallpatiant();
		}, (error) => {
			swal({
				title: 'Unable to fetch data, please try again'
			});
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

				swal({title: 'E-Mail ID does not exists,please signup to continue'});
			  else if (error.status === 403)

				swal({title: 'Account Disabled,contact Dental-Live'});
			  else if (error.status === 400)

				swal({title: 'Wrong Password,please try again'});
			  else if (error.status === 401)

				swal({title: 'Account Not Verified,Please activate the account from the Email sent to the Email address.'});
			  else if (error.status === 428)

				swal({title: error.error});
			  else

				swal({title: 'Unable to fetch the data, please try again'});
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

	
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			
			//url += "&invitedUserId="+user.dentalId;
			url += "?invitedUserMail="+user.emailAddress;
			url += "&presentStatus=1";
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.allMember = JSON.parse(Response.toString());
					this.allMember.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					//alert(JSON.stringify(this.allMember));
					this.getColleguespatiant();
					//alert(JSON.stringify(this.allMember));
				}
			}, error => {
			  if (error.status === 404)
				swal('E-Mail ID does not exists,please signup to continue');
			  else if (error.status === 403)
				swal('Account Disabled,contact Dental-Live');
			  else if (error.status === 400)
				swal('Wrong Password,please try again');
			  else if (error.status === 401)
				swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
			  else if (error.status === 428)
				swal(error.error);
			  else
				swal('Unable to fetch the data, please try again');
			});
		}
	}
	
	getColleguespatiant() {
		//alert(JSON.stringify(this.allMember));
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			this.colleaguesData = Array();	
			//alert(JSON.stringify(this.allMember[k].patientId));
			for(var k=0; k < this.allMember.length; k++)
			{
				let url1 = this.utility.apiData.userPatients.ApiUrl;
					url1 += "?patientId="+this.allMember[k].patientId;
					this.dataService.getallData(url1, true).subscribe(Response => {
						if (Response)
						{
							let AllDate = JSON.parse(Response.toString());
							//alert(JSON.stringify(AllDate));
							this.colleaguesData.push({
							  resourceOwner: AllDate.firstName,
							  firstName: AllDate.firstName,
							  lastName: AllDate.lastName,
							  dob: AllDate.dob,
							  email: AllDate.email,
							  isActive: AllDate.isActive,
							  dateCreated: AllDate.dateCreated,
							  patientId: AllDate.patientId
							});
						}
					}, (error) => {
					swal({
						title: 'Unable to fetch data, please try again'
					});
				  return false;
				});
			}
			this.colleaguesData = this.colleaguesData.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? 1 : -1));
			//alert(JSON.stringify(this.colleaguesData));
		}
	}
}