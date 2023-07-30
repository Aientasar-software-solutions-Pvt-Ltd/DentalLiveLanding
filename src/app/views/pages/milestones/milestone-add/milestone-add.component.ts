import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CvfastNewComponent } from 'src/app/cvfastFiles/cvfast-new/cvfast-new.component';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import swal from 'sweetalert';


@Component({
	selector: 'app-milestone-add',
	templateUrl: './milestone-add.component.html',
	styleUrls: ['./milestone-add.component.css'],
	providers: [CrudOperationsService]
})
export class MilestoneAddComponent implements OnInit {
	@ViewChild("mainForm", { static: false }) mainForm: NgForm;
	@ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
	module = 'milestones';
	hasCase = false;
	mode = "Add"
	user = this.utility.getUserDetails();
	currentDate = new Date()

	constructor(
		private route: ActivatedRoute,
		public utility: UtilityServiceV2,
		public formInterface: CrudOperationsService,
	) { }

	ngAfterViewInit(): void {
		this.formInterface.mainForm = this.mainForm
		this.formInterface.cvfast = this.cvfast;
		this.currentDate = new Date();
	}

	ngOnInit(): void {
		this.formInterface.section = JSON.parse(JSON.stringify(this.utility.apiData[this.module]));
		this.formInterface.resetForm();
		console.log(this.utility.apiData[this.module]);
		this.formInterface.loadDependencies().then(() => {

			this.route.parent.parent.paramMap.subscribe((parentParams) => {

				if (parentParams.get("caseId") && parentParams.get("caseId") != "")
					this.hasCase = true

				this.route.paramMap.subscribe((params) => {

					if (params.get("id") && params.get("id") != "") {
						this.mode = "Update"
						this.formInterface.hasData(params.get("id"));
					} else {
						if (parentParams.get("caseId") && parentParams.get("caseId") != "") {
							this.formInterface.loadCaseData(parentParams.get("caseId"))

						}
					}
				});
			});
		})
	}

	//Special functions for this class
	selectCase(event) {
		if (!event) return;
		this.formInterface.object.caseId = event.caseId
		this.formInterface.object.patientId = event.patientId
		this.formInterface.object.patientName = event.patientName
	}

	toInt(val, event) {
		this.formInterface.object[val] = Number(event);
	}

	customSubmit(form) {

		this.formInterface.object.startdate = new Date(form.value.startdate).getTime();
		this.formInterface.object.duedate = new Date(form.value.duedate).getTime();


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

		if (this.hasCase)
			this.formInterface.section.backUrl = '/cases/cases/case-view/' + this.formInterface.object.caseId + '/milestones'
		this.formInterface.onSubmit()
	}
}