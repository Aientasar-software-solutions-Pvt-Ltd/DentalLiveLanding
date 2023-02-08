import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';

@Component({
	selector: 'app-general-task-add',
	templateUrl: './general-task-add.component.html',
	styleUrls: ['./general-task-add.component.css'],
	providers: [CrudOperationsService]
})
export class GeneralTaskAddComponent implements OnInit {
	@ViewChild("mainForm", { static: false }) mainForm: NgForm;
	@ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
	module = 'tasks';
	milestoneObject = null;
	caseMembers = [];
	hasCase = false;
	mode = "Add"
	user = this.utility.getUserDetails();

	constructor(
		private route: ActivatedRoute,
		public utility: UtilityServiceV2,
		public formInterface: CrudOperationsService,
		private router: Router,
		private dataService: ApiDataService,
	) { }

	ngAfterViewInit(): void {
		this.formInterface.mainForm = this.mainForm
		this.formInterface.cvfast = this.cvfast;
	}

	ngOnInit(): void {
		this.formInterface.section = JSON.parse(JSON.stringify(this.utility.apiData[this.module]));
		this.formInterface.resetForm();
		this.formInterface.loadDependencies().then(() => {

			this.route.parent.paramMap.subscribe(async (milestoneParams) => {

				if (!milestoneParams.get("milestoneId") || milestoneParams.get("milestoneId") == "") {
					swal("No Milestone exists for selected task")
					this.router.navigate([this.formInterface.section.backUrl])
					return;
				}

				if (this.utility.metadata.patients.length == 0)
					await this.utility.loadPreFetchData("patients");
				if (this.utility.metadata.cases.length == 0)
					await this.utility.loadPreFetchData("cases");
				if (this.utility.metadata.users.length == 0)
					await this.utility.loadPreFetchData("users");

				this.formInterface.section.backUrl = '/milestones/milestone-details/' + milestoneParams.get("milestoneId")

				this.loadMilestone(milestoneParams.get("milestoneId")).then((result) => {
					this.formInterface.object.milestoneId = this.milestoneObject.milestoneId
					this.formInterface.object.caseId = this.milestoneObject.caseId
					this.formInterface.object.patientId = this.milestoneObject.patientId
					this.formInterface.object.patientName = this.milestoneObject.patientName
					this.populateCaseMembers(this.formInterface.object.caseId)

					this.route.parent.parent.parent.paramMap.subscribe((caseParams) => {

						if (caseParams.get("caseId") && caseParams.get("caseId") != "") {
							this.hasCase = true;
							this.formInterface.section.backUrl = '/cases/cases/case-view/' + this.milestoneObject.caseId + '/milestones/milestone-details/' + this.milestoneObject.milestoneId
						}
						else
							this.formInterface.section.backUrl = '/milestones/milestone-details/' + this.milestoneObject.milestoneId
					});

					this.route.paramMap.subscribe((params) => {
						if (params.get("taskId") && params.get("taskId") != "") {
							this.mode = "Update"
							this.formInterface.hasData(params.get("taskId"))
						}
					});
				});

			});
		})
	}


	//Special functions for this class

	populateCaseMembers(caseId) {
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

	async loadMilestone(id) {
		try {
			let Response = await this.dataService.getallData(this.utility.baseUrl + "milestones?milestoneId" + "=" + id, true).toPromise();
			if (!Response) {
				swal("No Milestone exists for selected task")
				this.router.navigate([this.formInterface.section.backUrl])
				return;
			}
			this.milestoneObject = JSON.parse(Response.toString())
		} catch (error) {
			swal("No Milestone exists for selected task")
			this.router.navigate([this.formInterface.section.backUrl])
			return;
		}
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
		if (this.formInterface.object.startdate > this.formInterface.object.duedate) {
			swal("Due Date Should Be Greater Than Start Date")
			return
		}
		this.formInterface.onSubmit()
	}

}