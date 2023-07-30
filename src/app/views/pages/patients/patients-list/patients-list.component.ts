import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';

@Component({
	selector: 'app-patients-list',
	templateUrl: './patients-list.component.html',
	styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
	module = 'patients';
	isLoadingData = true;
	patientDataPirstine: any;
	patientData: any;
	colleaguesData: any;
	colleaguesDataPirstine: any;
	shimmer = Array;
	isPatient = true;
	dtOptions: DataTables.Settings = {};
	user = this.utility.getUserDetails()

	constructor(private dataService: ApiDataService, private router: Router, public utility: UtilityServiceV2, private usr: AccdetailsService) { }

	ngOnInit(): void {
		this.loadPatients();

		this.utility.getArrayObservable().subscribe(array => {
			if (array.some(el => el.module === this.module && el.isProcessed))
				this.loadPatients(true)
		});

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
					first: "<i class='bx bx-first-page'></i>",
					previous: "<i class='bx bx-chevron-left'></i>",
					next: "<i class='bx bx-chevron-right'></i>",
					last: "<i class='bx bx-last-page'></i>"
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

	loadPatients(force = false) {
		if (!force && this.patientData) return;
		this.patientData = []
		this.isLoadingData = true;
		let url = this.utility.baseUrl + this.module + '?resourceOwner=' + this.user.emailAddress;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response) {
				let data = JSON.parse(Response.toString());
				this.patientDataPirstine = this.patientData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
				//stupid library used-->fix required for no data label
				if (this.patientData.length > 0) {
					Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
						element.classList.add('d-none')
					});
				}
			}
			this.isLoadingData = false;
		}, (error) => {
			this.utility.showError(error.status)
			this.isLoadingData = false;
		});

	}

	loadColleagues() {
		if (this.colleaguesData) return;
		this.colleaguesData = []
		this.isLoadingData = true;
		let user = this.utility.getUserDetails()
		if (user) {
			//get all colleagues who have invited to cases
			this.dataService.getallData(this.utility.baseUrl + "caseinvites?invitedUserMail=" + user.emailAddress + "&presentStatus=1", true).subscribe(Response => {
				let data = JSON.parse(Response.toString());
				let patientIdArray = data.map((item) => {
					return item.patientId;
				})
				if (patientIdArray.length > 0) {
					//get all patients data whose cases working on 
					this.dataService.getallData(this.utility.baseUrl + "patients?patientIdArray=" + patientIdArray.toString(), true).subscribe(pResponse => {
						let pdata = JSON.parse(pResponse.toString());
						this.colleaguesDataPirstine = this.colleaguesData = pdata.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
						this.isLoadingData = false;
					}, (error) => {
						this.utility.showError(error.status)
						this.isLoadingData = false;
					});
				} else {
					this.isLoadingData = false;
				}
			}, (error) => {
				this.utility.showError(error.status)
				this.isLoadingData = false;
			});
		}
	}

	filterSubmit(form: NgForm) {
		let query = "";
		if (form.value.firstName) {
			query = query + ' firstName:' + form.value.firstName
		}
		if (form.value.dateFrom) {
			query = query + ' dateCreated:>' + new Date(form.value.dateFrom).getTime()
		}
		if (form.value.dateTo) {
			query = query + ' dateCreated:>' + new Date(form.value.dateTo).getTime()
		}
		let filterData = filter(this.patientDataPirstine, {
			keywords: query
		});
		this.isPatient ? this.patientData = filterData : this.colleaguesData = filterData

	}
}