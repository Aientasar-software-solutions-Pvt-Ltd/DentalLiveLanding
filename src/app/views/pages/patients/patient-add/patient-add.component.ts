import { CvfastNewComponent } from '../../../../cvfastFiles/cvfast-new/cvfast-new.component';
import { CrudOperationsService } from './../../../../crud-operations.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import swal from 'sweetalert';

@Component({
	selector: 'app-patient-add',
	templateUrl: './patient-add.component.html',
	styleUrls: ['./patient-add.component.css'],
	providers: [CrudOperationsService]
})

export class PatientAddComponent implements OnInit, AfterViewInit {

	@ViewChild("mainForm", { static: false }) mainForm: NgForm;
	@ViewChild(CvfastNewComponent) cvfast!: CvfastNewComponent;
	module = 'patients';
	mode = "Add"

	constructor(
		private route: ActivatedRoute,
		private utility: UtilityServiceV2,
		public formInterface: CrudOperationsService,
	) { }
	ngAfterViewInit(): void {
		this.formInterface.mainForm = this.mainForm
		this.formInterface.cvfast = this.cvfast;

	}

	ngOnInit(): void {
		this.formInterface.section = this.utility.apiData[this.module]
		this.formInterface.resetForm();
		this.route.paramMap.subscribe((params) => {
			if (params.get("id") && params.get("id") != "") {
				this.formInterface.hasData(params.get("id"));
				this.mode = "Update"
			}
		});

	}

	//special function for this component
	onSubmitMedication(form: NgForm) {
		if (form.invalid) {
			swal("Enter required feilds")
			form.form.markAllAsTouched();
			return;
		}

		this.formInterface.object.medication.push(form.value)
		form.reset()
	}
	removeMedication(item) {
		var index = this.formInterface.object.medication.indexOf(item);
		this.formInterface.object.medication.splice(index, 1);
	}
	assignCarrierDate(event) {
		this.formInterface.object.insurance.policydate = new Date(event).getTime();
	}

	customSubmit() {
		let date1 = new Date(this.formInterface.object.dob);
		let date2 = new Date();

		date1.setHours(0, 0, 0, 0);
		date2.setHours(0, 0, 0, 0);

		if (date1 > date2) {
			swal("DOB Should Be Less Than Today’s Date")
			return
		}

		this.formInterface.onSubmit()
	}
}