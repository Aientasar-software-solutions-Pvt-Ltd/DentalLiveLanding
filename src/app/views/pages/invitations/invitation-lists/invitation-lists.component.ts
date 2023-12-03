import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiDataService } from '../../users/api-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { filter } from 'smart-array-filter';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import swal from 'sweetalert';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'app-invitation-lists',
	templateUrl: './invitation-lists.component.html',
	styleUrls: ['./invitation-lists.component.css'],
	providers: [CrudOperationsService]
})
export class InvitationListsComponent implements OnInit {
	@ViewChild(CvfastNewComponent, { static: false }) inviteText!: CvfastNewComponent;
	@ViewChild(CvfastNewComponent, { static: false }) cvfastReply!: CvfastNewComponent;
	@ViewChild(NgSelectComponent) selectedCase: NgSelectComponent;

	module = 'caseinvites';
	isLoadingData = true;
	baseDataPirstine: any;
	baseData: any;
	baseColleagueDataPirstine: any;
	baseColleagueData: any;
	shimmer = Array;
	isOwn = false;
	dtOptions: DataTables.Settings = {};
	user = this.utility.getUserDetails()
	selectedItem = null;
	selectedUsers = [];
	isUploadingData = false;
	invitations = ""
	nonInvitedMembers = [];
	caseDetail = null;
	allCases: any
	allPatients: any;

	constructor(
		private route: ActivatedRoute,
		private dataService: ApiDataService,
		private router: Router,
		public utility: UtilityServiceV2,
		private cdref: ChangeDetectorRef,
	) { }

	ngOnInit(): void {

		//this.allPatients = await this.utility.loadAllPatients();
		this.loadColleagueData();

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

	getCaseData(caseId) {
		if (this.allCases && Array.isArray(this.allCases)) {
			let filterData = this.allCases.find(x => x['caseId'] == caseId);
			if (filterData)
				return filterData.title
		}
	}

	getPatientData(patientId) {
		if (this.allPatients && Array.isArray(this.allPatients)) {
			let filterData = this.allPatients.find(x => x['patientId'] == patientId);
			if (filterData)
				return (filterData.firstName + " " + filterData.lastName)
		}
		return true
	}

	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}

	async loadBaseData(reload = false) {
		if (this.baseData && !reload) return;
		this.isLoadingData = true;
		try {
			let url = this.utility.baseUrl + this.module + "?resourceOwner=" + this.user.emailAddress;
			console.log(url)
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response) {
					let data = JSON.parse(Response.toString());

					this.baseDataPirstine = this.baseData = data.sort((first, second) => 0 - (first.dateUpdated < second.dateUpdated ? -1 : 1));
					this.isLoadingData = false;
				}
			}, (error) => {
				this.utility.showError(error.status)
				this.isLoadingData = false;
			});
		} catch (error) {
			console.log(error)
		}
	}

	async loadColleagueData(reload = false) {

		await this.utility.loadPreFetchData("users");
		await this.utility.loadPreFetchData("cases");
		await this.utility.loadPreFetchData("patients");
		this.allCases = await this.utility.loadAllCases();

		if (this.baseColleagueData && !reload) return;
		this.isLoadingData = true;
		try {
			let url = this.utility.baseUrl + this.module + "?invitedUserMail=" + this.user.emailAddress;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response) {
					let data = JSON.parse(Response.toString());
					this.baseColleagueDataPirstine = this.baseColleagueData = data.sort((first, second) => 0 - (first.dateUpdated < second.dateUpdated ? -1 : 1));
					this.isLoadingData = false;
				}
			}, (error) => {
				this.utility.showError(error.status)
				this.isLoadingData = false;
			});
		} catch (error) {
			console.log(error)
		}
	}


	filterSubmit(form: NgForm) {
		let query = "";
		if (form.value.dateFrom) {
			query = query + ' dateCreated:>' + new Date(form.value.dateFrom).getTime()
		}
		if (form.value.dateTo) {
			query = query + ' dateCreated:>' + new Date(form.value.dateTo).getTime()
		}
		let filterData = filter(this.baseDataPirstine, {
			keywords: query
		});
		this.isOwn ? this.baseData = filterData : this.baseColleagueData = filterData

	}

	//runs on caseChange 
	async getNonInvitedMembers(caseDetail) {
		this.caseDetail = caseDetail

		//get list of invited members
		this.nonInvitedMembers = [];

		if (!caseDetail) return;
		try {
			let url = this.utility.baseUrl + this.module + "?caseId=" + this.caseDetail.caseId;
			let Response = await this.dataService.getallData(url, true).toPromise()
			if (Response) {
				let members = JSON.parse(Response.toString());

				if (!members || members.length == 0) {
					this.nonInvitedMembers = [...this.utility.metadata.users]
				} else {
					let assignMem = []

					this.utility.metadata.users.forEach(arr => {
						if (!members.find(user => user.invitedUserMail == arr.emailAddress))
							assignMem.push(arr);
					});
					this.nonInvitedMembers = assignMem
				}
				//remove case owner from list
				const index = this.nonInvitedMembers.findIndex(element => element.emailAddress == caseDetail.resourceOwner);
				if (index >= 0) this.nonInvitedMembers.splice(index, 1);
			}

		} catch (error) {
			(error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
			return;
		}
	}

	//special function for this class
	async sendInvite(cvfast: CvfastNewComponent) {
		if (!this.caseDetail) {
			swal("Please Select A Case To Continue");
			return;
		}
		if (this.selectedUsers.length == 0) {
			swal("Please Select Members");
			return;
		}
		this.isUploadingData = true;

		try {
			//process cvfast Files --> send invites
			let cvfastText = await cvfast.processFiles();
			let promises = []

			//create form object and --> process form data to dynaomDB-->this.object
			this.selectedUsers.forEach(user => {
				let invite = {
					"invitationId": "",
					"caseId": this.caseDetail.caseId,
					"patientId": this.caseDetail.patientId,
					"patientName": this.caseDetail.patientName,
					"invitedUserMail": user.emailAddress,
					"invitedUserId": user.dentalId,
					"presentStatus": 0,
					"invitationText": cvfastText,
				}
				promises.push(this.dataService.postData(this.utility.baseUrl + this.module, JSON.stringify(invite), true).toPromise())
			});
			await Promise.all(promises)
			swal("Invitations sent succesfully")
			document.getElementById("addInvite").click();
			this.resetInviteForm()
			this.isUploadingData = false;
			this.loadBaseData(true)
		} catch (error) {
			(error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
			return;
		}
	}

	async updateInvite(isDel, cvfast?: CvfastNewComponent, status?) {
		if (!this.selectedItem) return
		let item = { ...this.selectedItem }
		this.isUploadingData = true;
		try {
			if (isDel) {
				let result = await swal('Do you want to Delete this Invitation?', {
					buttons: ["Cancel", "Continue"],
				})

				if (result) {
					item.presentStatus = 3;
					swal("Processing...please wait...", {
						buttons: [false, false],
						closeOnClickOutside: false,
					});
					await this.dataService.putData(this.utility.baseUrl + this.module, JSON.stringify(item), true).toPromise();
					swal.close();
					swal("Deleted succesfully");
					this.selectedItem = null;
					this.isUploadingData = false;
					this.loadBaseData(true)
				}
			} else {
				//process cvfast Files --> update invites
				let cvfastText = await cvfast.processFiles();
				item.responseText = cvfastText;
				item.presentStatus = status;
				swal("Processing...please wait...", {
					buttons: [false, false],
					closeOnClickOutside: false,
				});
				await this.dataService.putData(this.utility.baseUrl + this.module, JSON.stringify(item), true).toPromise();
				swal.close();
				swal("Response sent succesfully");
				document.getElementById("showInviteClose").click();
				this.resetResposneForm(null);
				this.isUploadingData = false;
				this.loadColleagueData(true)
			}

		} catch (error) {
			swal.close();
			(error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
			return;
		}
	}

	resetInviteForm() {
		this.caseDetail = null;
		this.selectedCase.handleClearClick();
		this.selectedUsers = [];
		this.inviteText.resetForm()
		this.cdref.detectChanges()
	}

	resetResposneForm(data) {
		this.selectedItem = null
		this.cdref.detectChanges()
		this.selectedItem = data;
		this.cvfastReply.resetForm()
		this.cdref.detectChanges()
	}

}