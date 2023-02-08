import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import { ApiDataService } from '../../users/api-data.service';
import swal from 'sweetalert';
import { ReferralGuideComponent } from '../referral-guide/referral-guide.component';

@Component({
	selector: 'app-referral-add',
	templateUrl: './referral-add.component.html',
	styleUrls: ['./referral-add.component.css'],
	providers: [CrudOperationsService]
})
export class ReferralAddComponent implements OnInit {
	@ViewChild("mainForm", { static: false }) mainForm: NgForm;
	@ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
	@ViewChild(ReferralGuideComponent) orders: ReferralGuideComponent;
	module = 'referrals';
	caseMembers = [];
	viewInit = false;
	hasCase = false;
	mode = "Add"
	user = this.utility.getUserDetails();

	constructor(
		private route: ActivatedRoute,
		public utility: UtilityServiceV2,
		public formInterface: CrudOperationsService,
		private dataService: ApiDataService,
	) { }

	ngAfterViewInit(): void {
		this.viewInit = true;
		this.formInterface.mainForm = this.mainForm
		this.formInterface.cvfast = this.cvfast;
		if (this.formInterface.object.toothguide)
			this.orders.setToothGuide(this.formInterface.object.toothguide)
	}

	ngOnInit(): void {
		this.formInterface.section = JSON.parse(JSON.stringify(this.utility.apiData[this.module]));
		this.formInterface.resetForm();
		this.formInterface.loadDependencies().then(() => {

			this.route.parent.parent.paramMap.subscribe((parentParams) => {

				if (parentParams.get("caseId") && parentParams.get("caseId") != "")
					this.hasCase = true

				this.route.paramMap.subscribe((params) => {

					if (params.get("id") && params.get("id") != "") {
						this.mode = "Update"
						this.formInterface.hasData(params.get("id")).then((Reposne) => {
							this.orders.setToothGuide(this.formInterface.object.toothguide);
							this.populateCaseMembers(this.formInterface.object.caseId)
						})
					} else {
						if (parentParams.get("caseId") && parentParams.get("caseId") != "") {
							this.formInterface.loadCaseData(parentParams.get("caseId"))
							this.populateCaseMembers(parentParams.get("caseId"))

						}
					}
				});
			});
		})
	}

	//Special functions for this class
	selectCase(event) {
		this.formInterface.object.caseId = ""
		this.caseMembers = []
		this.formInterface.object.members = []
		if (!event) return;
		this.formInterface.object.caseId = event.caseId
		this.formInterface.object.patientId = event.patientId
		this.formInterface.object.patientName = event.patientName
		this.populateCaseMembers(this.formInterface.object.caseId)
	}

	populateCaseMembers(caseId) {
		//all members
		// member with caseid filter
		//selected members
		//event hadler on selection to populate paent array
		//if member is existing in memebers array then show remove button,else show add button

		//caseinvites --> get accepted uses of this case --> send api for emailaddressarray --> bind users
		this.dataService.getallData(this.utility.baseUrl + "caseinvites?caseId=" + caseId + "&presentStatus=1", true).subscribe(
			(Response) => {
				let data = JSON.parse(Response.toString());
				let emailArray = data.map((item) => {
					if (this.user.emailAddress != item.invitedUserMail)
						return item.invitedUserMail;
				})
				if (emailArray.length > 0) {
					//get all cases data whose cases working on 
					this.dataService.getallData(this.utility.baseUrl + "users?emailAddressArray=" + emailArray.toString(), true).subscribe(pResponse => {
						this.caseMembers = JSON.parse(pResponse.toString());
					}, (error) => {
						this.utility.showError(error.status)
						this.formInterface.isLoadingData = false;
					});
				}
			}, (error) => {
				this.utility.showError(error.status)
				this.formInterface.isLoadingData = false;
			});
	}

	customSubmit() {
		if (this.mode == "Add") {
			let date1 = new Date(this.formInterface.object.startdate);
			let date2 = new Date();

			date1.setHours(0, 0, 0, 0);
			date2.setHours(0, 0, 0, 0);

			if (date1 < date2) {
				swal("Start Date Should Not Be Less Than Today’s Date")
				return
			}

		}

		if (this.formInterface.object.startdate > this.formInterface.object.enddate) {
			swal("End Date Should Be Greater Than Start Date")
			return
		}

		if (this.hasCase)
			this.formInterface.section.backUrl = '/cases/cases/case-view/' + this.formInterface.object.caseId + '/referrals'
		this.formInterface.object.toothguide = this.orders.getToothGuide()
		if (this.formInterface.object.members.length == 0) {
			swal("Please Assign Member To Continue")
			return
		}
		if (Object.keys(this.formInterface.object.toothguide).length === 0) {
			swal("Tooth Guide Should Not be Empty")
			return;
		}
		this.formInterface.onSubmit()
	}
}