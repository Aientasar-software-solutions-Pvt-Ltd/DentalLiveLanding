import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';

@Component({
	selector: 'app-case-list',
	templateUrl: './case-list.component.html',
	styleUrls: ['./case-list.component.css'],
	exportAs: 'CaseListComponent'
})
export class CaseListComponent implements OnInit {

	module = 'cases';
	@Input() patientId = null;
	isLoadingData = true;
	casesDataPirstine: any;
	casesData: any;
	colleaguesData: any;
	colleaguesDataPirstine: any;
	shimmer = Array;
	isCase = true;
	dtOptions: DataTables.Settings = {};
	user = this.utility.getUserDetails()

	constructor(
		private dataService: ApiDataService,
		private router: Router,
		public utility: UtilityServiceV2
	) { }

	ngOnInit(): void {
		this.loadCases();
		if (this.patientId) this.loadColleagues()

		this.utility.getArrayObservable().subscribe(array => {
			if (array.some(el => el.module === this.module && el.isProcessed))
				this.loadCases(true)
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

	loadCases(force = false) {
		if (!force && this.casesData) return;
		this.casesData = [];
		this.isLoadingData = true;
		let url = this.utility.baseUrl + this.module + '?resourceOwner=' + this.user.emailAddress;
		if (this.patientId) url = url + "&patientId=" + this.patientId
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response) {
				let data = JSON.parse(Response.toString());
				this.casesDataPirstine = this.casesData = data.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
				this.isLoadingData = false;
				//stupid library used-->fix required for no data label
				if (this.casesData.length > 0) {
					Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
						element.classList.add('d-none')
					});
				}
			}
		}, (error) => {
			this.utility.showError(error.status)
			this.isLoadingData = false;
		});

	}

	loadColleagues() {
		if (this.colleaguesData) return;
		this.colleaguesData = [];
		this.isLoadingData = true;
		let user = this.utility.getUserDetails()
		if (user) {
			//get all colleagues who have invited to cases
			this.dataService.getallData(this.utility.baseUrl + "caseinvites?invitedUserMail=" + user.emailAddress + "&presentStatus=1", true).subscribe(Response => {
				let data = JSON.parse(Response.toString());
				let caseIdArray = data.map((item) => {
					return item.caseId;
				})
				if (caseIdArray.length > 0) {
					//get all cases data whose cases working on 
					let url = this.utility.baseUrl + "cases?caseIdArray=" + caseIdArray.toString()
					if (this.patientId) url = url + "&patientId=" + this.patientId
					this.dataService.getallData(url, true).subscribe(pResponse => {
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
		if (form.value.patientName) {
			query = query + ' patientName:' + form.value.patientName
		}
		if (form.value.title) {
			query = query + ' title:' + form.value.title
		}
		if (form.value.dateFrom) {
			query = query + ' dateCreated:>' + new Date(form.value.dateFrom).getTime()
		}
		if (form.value.dateTo) {
			query = query + ' dateCreated:>' + new Date(form.value.dateTo).getTime()
		}
		let filterData = filter(this.casesDataPirstine, {
			keywords: query
		});
		this.isCase ? this.casesData = filterData : this.colleaguesData = filterData
	}
}