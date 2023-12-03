import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../../users/api-data.service';

@Component({
	selector: 'app-patient-details',
	templateUrl: './patient-details.component.html',
	styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit, AfterViewInit {
	module = 'patients';
	isLoadingData = true;
	baseData: any;
	id = "";
	user = this.utility.getUserDetails()
	showDescription = false;
	@ViewChild('patientList') patientList: ElementRef;
	isScroll = true;


	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private dataService: ApiDataService,
		public utility: UtilityServiceV2
	) { }
	ngAfterViewInit() {
		setTimeout(() => {
			if (this.isScroll)
				this.patientList.nativeElement.scrollIntoView({ behavior: 'smooth' });
		}, 2000);
	}

	ngOnInit(): void {
		this.baseData = this.utility.apiData[this.module].object
		this.route.paramMap.subscribe((params) => {
			if (params.get("isScroll")) this.isScroll = true;
			if (params.get("id") && params.get("id") != "") {
				this.id = params.get("id");
				this.loadBaseData();
			} else {
				swal("No Data Found");
				this.router.navigate([this.utility.apiData[this.module].backUrl])
			}
		});
	}

	getPhoneNumber(no) {
		no = no.slice(0, 3) + "-" + no.slice(3);
		no = no.slice(0, 7) + "-" + no.slice(7)
		return no;
	}

	async loadBaseData() {
		try {
			let url = this.utility.baseUrl + this.module;
			if (this.id) url = url + "?patientId=" + this.id
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response) {
					this.baseData = JSON.parse(Response.toString());
					this.isLoadingData = false;
				}
			}, (error) => {
				this.utility.showError(error.status)
				this.isLoadingData = false;
				this.router.navigate([this.utility.apiData[this.module].backUrl])
			});
		} catch (error) {
			swal("No Data Found");
			console.log(error)
			this.router.navigate([this.utility.apiData[this.module].backUrl])
		}
	}
}