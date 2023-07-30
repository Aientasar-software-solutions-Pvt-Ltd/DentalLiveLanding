import { CvfastNewComponent } from '../../../../cvfastFiles/cvfast-new/cvfast-new.component';
import { CrudOperationsService } from './../../../../crud-operations.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import swal from 'sweetalert';
import { Country, State } from 'country-state-city';
import { v4 as uuidv4 } from "uuid";
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

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
	countries = [];
	states = [];
	cities = [];
	myModal = null;

	imageChangedEvent: any = '';
	croppedImage: any = '';
	scale = 1;
	transform: ImageTransform = {};

	constructor(
		private route: ActivatedRoute,
		public utility: UtilityServiceV2,
		public formInterface: CrudOperationsService,
		private elementRef: ElementRef
	) {

	}

	ngAfterViewInit(): void {
		this.formInterface.mainForm = this.mainForm
		this.formInterface.cvfast = this.cvfast;
		//@ts-ignore
		this.myModal = new bootstrap.Modal(document.getElementById('pictureModal'))
	}

	poplStates(event) {
		this.states = State.getStatesOfCountry(event);
		this.formInterface.object.residingState = this.states[0].isoCode
		//this.poplCities();
	}

	// poplCities() {
	// 	this.cities = City.getCitiesOfState(this.formInterface.object.country, this.formInterface.object.residingState);
	// 	this.formInterface.object.city = this.cities[0].name
	// }

	ngOnInit(): void {
		this.formInterface.section = this.utility.apiData[this.module]
		this.formInterface.resetForm();
		this.route.paramMap.subscribe((params) => {
			if (params.get("id") && params.get("id") != "") {
				this.formInterface.hasData(params.get("id")).then(() => {
					this.countries = Country.getAllCountries();
					this.states = State.getStatesOfCountry(this.formInterface.object.country);
					//this.cities = City.getCitiesOfState(this.formInterface.object.country, this.formInterface.object.residingState);
				})
				this.mode = "Update"
			} else {
				this.countries = Country.getAllCountries();
			}
		});

	}

	//special function for this component
	onSubmitInsurance(form: NgForm) {
		console.log(form)
		if (form.invalid) {
			swal("Enter Required Fields")
			form.form.markAllAsTouched();
			return;
		}
		this.formInterface.object.insurance = form.value;
		this.formInterface.object.insurance.policydate = new Date(form.value.policydate).getTime();
		swal("Insurance Data Updated")
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
	// assignCarrierDate(event) {
	// 	this.formInterface.object.insurance.policydate = new Date(event).getTime();
	// }

	customSubmit(form) {
		// if (!this.formInterface.object.phone || this.formInterface.object.phone.toString().length < 11) {
		// 	swal("Invalid Phone Number")
		// 	return
		// }

		this.formInterface.object.dob = new Date(form.value.dob).getTime();

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

	addAvatar(event) {
		//checks if correct file format is selcted --> passes event to dailog box --> shows dialog
		if (event.target.files.length > 0) {
			if (!this.formInterface.allowedtypes.some(type => event.target.files[0].type.includes(type))) {
				swal("File format not allowed")
				return
			}
			this.imageChangedEvent = event;
			this.myModal.show();
		}
	}


	saveCroppedImage() {
		this.formInterface.tempAvatarImage = this.croppedImage//this becomes base64
		let filename = uuidv4() + ".jpg";
		this.formInterface.tempAvatarName = filename;

		fetch(this.croppedImage)
			.then(res => res.blob())
			.then(blob => {
				const file = new File([blob], "File name", { type: "image/png" })
				this.formInterface.avatarData = { name: file.name, binaryData: file }//this comes from base64tofile
			})
	}


	zoomOut() {
		this.scale -= .1;
		this.transform = {
			...this.transform,
			scale: this.scale
		};
	}

	zoomIn() {
		this.scale += .1;
		this.transform = {
			...this.transform,
			scale: this.scale
		};
	}

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}
	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	removeAvatar() {
		this.croppedImage = null;
		this.formInterface.avatarData = {};
		this.formInterface.tempAvatarImage = null;
		this.formInterface.tempAvatarName = null;
		this.formInterface.object.image = ""
	}
}