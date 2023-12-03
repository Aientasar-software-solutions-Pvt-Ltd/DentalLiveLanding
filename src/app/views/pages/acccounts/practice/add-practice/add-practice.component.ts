
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import "@lottiefiles/lottie-player";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { Country, State } from 'country-state-city';
import { CrudOperationsService } from 'src/app/crud-operations.service';
import Swal from 'sweetalert';
import { ApiDataService } from '../../../users/api-data.service';
import { UtilityService } from '../../../users/utility.service';
import * as CryptoJS from 'crypto-js';
import { environment } from "src/environments/environment";

@Component({
	selector: 'app-add-practice',
	templateUrl: './add-practice.component.html',
	styleUrls: ['./add-practice.component.css']
})
export class AddPracticeComponent implements OnInit, AfterViewInit {

	@ViewChild("mainForm", { static: false }) mainForm: NgForm;
	module = 'practices';
	mode = "Add"
	countries = [];
	states = [];
	cities = [];
	user = this.utility.getUserDetails()


	constructor(
		private route: ActivatedRoute,
		public utility: UtilityServiceV2,
		private dataService: ApiDataService,
		public utilityold: UtilityService,
		private router: Router,
		public formInterface: CrudOperationsService) {}

	ngAfterViewInit(): void {
		this.formInterface.mainForm = this.mainForm
	}

	poplStates(event) {
		this.states = State.getStatesOfCountry(event);
		this.formInterface.object.residingState = this.states[0].isoCode
	}

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

	async customSubmit() {
		this.formInterface.isUploadingData = true;
		try {
			let result = await this.formInterface.onSubmit(true, true);
			if (result.hasOwnProperty('error')) throw result;
			//check if this is the only practice --> if yes make it primary
			await this.utility.loadPreFetchData("practices", true);
			let userPrimaryPractice = this.utility.metadata['practices'].filter(item => item.resourceOwner == this.user.emailAddress);
			if (userPrimaryPractice.length == 1) {
				try {
					let userDetails = await this.dataService.getData(this.utilityold.apiData.userAccounts.ApiUrl, this.user.emailAddress, true).toPromise();
					if (!userDetails) return false
					let object = JSON.parse(userDetails.toString());
					object.primaryPractice = userPrimaryPractice[0].practiceId;
					object.isEdit = true;
					await this.dataService.putData(this.utilityold.apiData.userAccounts.ApiUrl, JSON.stringify(object)).toPromise();
					this.user.primaryPractice = userPrimaryPractice[0].practiceId;
					let encrypt = CryptoJS.AES.encrypt(JSON.stringify(this.user), environment.decryptKey).toString();
					sessionStorage.setItem('usr', encrypt);
					Swal("Updated Succesfully");
					this.router.navigate(['/accounts/details/practices']);
				} catch (error) {
					console.log(error)
					Swal("Failed To Process Request, Please Try Again");
				}
			} else {
				Swal("Updated Succesfully");
				this.router.navigate(['/accounts/details/practices']);
			}
			this.formInterface.isUploadingData = false;
		} catch (error) {
			(error['status']) ? this.utility.showError(error['status']) : Swal("Failed to Process files,please try again");
			this.formInterface.isUploadingData = false;
		}
		return true;
	}
}