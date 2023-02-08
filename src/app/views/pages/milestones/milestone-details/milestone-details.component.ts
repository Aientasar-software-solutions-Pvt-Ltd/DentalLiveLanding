import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';

@Component({
	selector: 'app-milestone-details',
	templateUrl: './milestone-details.component.html',
	styleUrls: ['./milestone-details.component.css']
})

export class MilestoneDetailsComponent implements OnInit {
	module = 'milestones';
	isLoadingData = true;
	baseData: any;
	id = "";
	tab = 0;
	hasCase = false;
	section = this.utility.apiData[this.module]
	backUrl = this.section.backUrl

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public utility: UtilityServiceV2,
		private dataService: ApiDataService,
	) { }


	async ngOnInit(): Promise<void> {
		this.baseData = this.section.object
		if (this.utility.metadata.patients.length == 0)
			await this.utility.loadPreFetchData("patients");
		if (this.utility.metadata.cases.length == 0)
			await this.utility.loadPreFetchData("cases");
		if (this.utility.metadata.users.length == 0)
			await this.utility.loadPreFetchData("users");


		this.route.parent.parent.parent.paramMap.subscribe((parentParams) => {
		 
			if (parentParams.get("caseId") && parentParams.get("caseId") != "") {
				this.hasCase = true
				this.backUrl = '/cases/cases/case-view/' + parentParams.get("caseId") + '/milestones'
			}

			this.route.paramMap.subscribe((params) => {
				 
				if (params.get("milestoneId") && params.get("milestoneId") != "") {
					this.id = params.get("milestoneId");
					this.loadBaseData();
				} else {
					swal("No Data Found");
					if (this.hasCase)
						this.router.navigate([this.backUrl])
					else
						this.router.navigate([this.backUrl])
				}
				if (params.get("hasTask")) this.tab = 2
			});
		});
	}

	async loadBaseData() {
		try {
			let url = this.utility.baseUrl + this.module;
			if (this.id) url = url + "?" + this.section.keyName + "=" + this.id
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response) {
					this.baseData = JSON.parse(Response.toString());
					 
					this.isLoadingData = false;
				}
			}, (error) => {
				this.utility.showError(error.status)
				this.isLoadingData = false;
				this.router.navigate([this.backUrl])
			});
		} catch (error) {
			swal("No Data Found");
			console.log(error)
			this.router.navigate([this.backUrl])
		}
	}
}
