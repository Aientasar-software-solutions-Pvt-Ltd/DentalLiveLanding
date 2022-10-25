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
	  columnDefs: [{
		"defaultContent": "-",
		"targets": "_all"
	  }]
	};
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	removeHTML(str){ 
		var tmp = document.createElement("DIV");
		tmp.innerHTML = str;
		return tmp.textContent || tmp.innerText || "";
	}
	getallpatiant() {
		this.tabledata = '';
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userPatients.ApiUrl;
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
				}
				this.tabledata = this.tabledata.reverse();
				this.getAllMembers();
				this.isLoadingData = false;
			}
		}, (error) => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		  return false;
		});
		}
	}
	editpatiant(patientId: any) {
		this.router.navigate(['/patients/patient-edit/'+patientId]);
	}
	viewpatiant(patientId: any) {
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
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		  return false;
		});
	}
	onSubmit(form: NgForm) {
		this.isLoadingData = true;
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			if(this.id != 'colleaguesPatients')
			{
				let url = this.utility.apiData.userPatients.ApiUrl;
				let strName = '';
				if(form.value.firstName != null)
				{
					strName = form.value.firstName;
				}
				let patiantName =strName.split(' ');
				if(patiantName[0] != '' && patiantName[0] != null)
				{
					url += "?firstName="+patiantName[0];
				}
				if((patiantName.length > 1) && patiantName[0] != null)
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
				if(form.value.dateFrom != '' && form.value.dateFrom != null)
				{
					//if(patiantName[0] != '' || (patiantName.length > 1) || patiantName[0] != null)
					if(form.value.firstName != '' && form.value.firstName != null)
					{ 
						url += "&dateFrom="+Date.parse(form.value.dateFrom);
					}
					else
					{
						url += "?dateFrom="+Date.parse(form.value.dateFrom);
					}
				}
				if(form.value.dateTo != '' && form.value.dateTo != null)
				{
					const mydate=form.value.dateTo;
					const newDate = new Date(mydate);
					const result = new Date(newDate.setDate(newDate.getDate() + 1));
					if(form.value.firstName != '' && form.value.firstName != null)
					{
						url += "&dateTo="+Date.parse(result);
					}
					else
					{
						url += "?dateTo="+Date.parse(result);
					}
				}
				this.dataService.getallData(url, true)
				.subscribe(Response => {
					if (Response)
					{
						let AllDate = JSON.parse(Response.toString());
						let patientDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
						this.tabledata = Array();	
						for(var k=0; k < patientDate.length; k++)
						{
								if(user.emailAddress == patientDate[k].resourceOwner)
								{
									if(this.id != 'colleaguesPatients')
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
								}
						}
						this.tabledata = this.tabledata.reverse();
						this.isLoadingData = false;
						form.resetForm(); // or form.reset();
					}
				}, error => {
					form.resetForm(); // or form.reset();
					if (error.status === 404)
					swal('No patient found');
					else if (error.status === 403)
					swal('You are unauthorized to access the data');
					else if (error.status === 400)
					swal('Invalid data provided, please try again');
					else if (error.status === 401)
					swal('You are unauthorized to access the page');
					else if (error.status === 409)
					swal('Duplicate data entered for first name or last name');
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
				});
			}
			else
			{
				this.colleaguesData = Array();	
				let url1 = this.utility.apiData.userPatients.ApiUrl;
					//url1 += "?patientId="+this.allMember[k].patientId;
					let strName = '';
					if(form.value.firstName != null)
					{
						strName = form.value.firstName;
					}
					let patiantName =strName.split(' ');
					if(patiantName[0] != '' && patiantName[0] != null)
					{
						url1 += "?firstName="+patiantName[0];
					}
					if((patiantName.length > 1) && patiantName[0] != null)
					{
						if(patiantName[1] != '')
						{
							if(patiantName[0] != '')
							{
								url1 += "&lastName="+patiantName[1];
							}
							else
							{
								url1 += "?lastName="+patiantName[1];
							}
						}
					}
					if(form.value.dateFrom != '' && form.value.dateFrom != null)
					{
						//if(patiantName[0] != '' || (patiantName.length > 1) || patiantName[0] != null)
						if(form.value.firstName != '' && form.value.firstName != null)
						{ 
							url1 += "&dateFrom="+Date.parse(form.value.dateFrom);
						}
						else
						{
							url1 += "?dateFrom="+Date.parse(form.value.dateFrom);
						}
					}
					if(form.value.dateTo != '' && form.value.dateTo != null)
					{
						const mydate=form.value.dateTo;
						const newDate = new Date(mydate);
						const result = new Date(newDate.setDate(newDate.getDate() + 1));
						if(form.value.firstName != '' && form.value.firstName != null)
						{
							url1 += "&dateTo="+Date.parse(result);
						}
						else
						{
							url1 += "?dateTo="+Date.parse(result);
						}
					}
					this.dataService.getallData(url1, true).subscribe(Response => {
						if (Response)
						{
							let AllDate = JSON.parse(Response.toString());
							//alert(JSON.stringify(AllDate));
							for(var k=0; k < AllDate.length; k++)
							{
								for(var l=0; l < this.allMember.length; l++)
								{
									if(this.allMember[l].patientId == AllDate[k].patientId)
									{
										this.colleaguesData.push({
										  resourceOwner: AllDate[k].resourceOwner,
										  firstName: AllDate[k].firstName,
										  lastName: AllDate[k].lastName,
										  dob: AllDate[k].dob,
										  email: AllDate[k].email,
										  isActive: AllDate[k].isActive,
										  dateCreated: AllDate[k].dateCreated,
										  patientId: AllDate[k].patientId
										});
									}
								}
							}
							this.colleaguesData = this.colleaguesData.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? 1 : -1));
							this.isLoadingData = false;
							form.resetForm(); // or form.reset();
						}
					}, (error) => {
						form.resetForm(); // or form.reset();
						if (error.status === 404)
						swal('No patient found');
						else if (error.status === 403)
						swal('You are unauthorized to access the data');
						else if (error.status === 400)
						swal('Invalid data provided, please try again');
						else if (error.status === 401)
						swal('You are unauthorized to access the page');
						else if (error.status === 409)
						swal('Duplicate data entered for first name or last name');
						else if (error.status === 405)
						swal('Due to dependency data unable to complete operation');
						else if (error.status === 500)
						swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
						else
						swal('Oops something went wrong, please try again');
					return false;
				});
			}
		}
	}
	
  checkUncheckAll() {
    for (var i = 0; i < this.tabledata.length; i++) {
      this.tabledata[i].isSelected = this.masterSelected;
    }
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.tabledata.every(function(item:any) {
        return item.isSelected == true;
      })
  }

  // Get List of Checked Items

	
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			
			url += "?invitedUserMail="+user.emailAddress;
			url += "&presentStatus=1";
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.allMember = JSON.parse(Response.toString());
					this.allMember.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.getColleguespatiant();
					
				}
			}, error => {
				if (error.status === 404)
				swal('No patient found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered for first name or last name');
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
			});
		}
	}
	
	getColleguespatiant() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			this.colleaguesData = Array();	
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
							  resourceOwner: AllDate.resourceOwner,
							  firstName: AllDate.firstName,
							  lastName: AllDate.lastName,
							  dob: AllDate.dob,
							  email: AllDate.email,
							  isActive: AllDate.isActive,
							  dateCreated: AllDate.dateCreated,
							  patientId: AllDate.patientId
							});
							this.isLoadingData = false;
						}
					}, (error) => {
						if (error.status === 404)
						swal('No patient found');
						else if (error.status === 403)
						swal('You are unauthorized to access the data');
						else if (error.status === 400)
						swal('Invalid data provided, please try again');
						else if (error.status === 401)
						swal('You are unauthorized to access the page');
						else if (error.status === 409)
						swal('Duplicate data entered for first name or last name');
						else if (error.status === 405)
						swal('Due to dependency data unable to complete operation');
						else if (error.status === 500)
						swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
						else
						swal('Oops something went wrong, please try again');
					return false;
				});
			}
			this.colleaguesData = this.colleaguesData.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? 1 : -1));
		}
	}
}