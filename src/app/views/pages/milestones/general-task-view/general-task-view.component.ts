import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';

@Component({
	selector: 'app-general-task-view',
	templateUrl: './general-task-view.component.html',
	styleUrls: ['./general-task-view.component.css']
})
export class GeneralTaskViewComponent implements OnInit {
	module = 'tasks';
	isLoadingData = true;
	baseData: any;
	id = "";
	isDetail = true;
	hasCase = false;
	section = this.utility.apiData[this.module]
	backUrl = this.section.backUrl
	milestoneObject = null;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public utility: UtilityServiceV2,
		private dataService: ApiDataService,
	) { }

	async ngOnInit(): Promise<void> {
		this.baseData = this.section.object

		this.route.parent.paramMap.subscribe(async (milestoneParams) => {

			if (!milestoneParams.get("milestoneId") || milestoneParams.get("milestoneId") == "") {
				swal("No Milestone exists for selected task")
				this.router.navigate([this.backUrl])
				return;
			}

			this.backUrl = '/milestones/milestone-details/' + milestoneParams.get("milestoneId")

			if (this.utility.metadata.patients.length == 0)
				await this.utility.loadPreFetchData("patients");
			if (this.utility.metadata.cases.length == 0)
				await this.utility.loadPreFetchData("cases");
			if (this.utility.metadata.users.length == 0)
				await this.utility.loadPreFetchData("users");


			this.loadMilestone(milestoneParams.get("milestoneId")).then((result) => {

				this.route.paramMap.subscribe((params) => {
					if (params.get("taskId") && params.get("taskId") != "") {
						this.id = params.get("taskId");
						this.loadBaseData();
					} else {
						swal("No Data Found");
						this.router.navigate([this.backUrl])
					}
				});

				this.route.parent.parent.parent.paramMap.subscribe((caseParams) => {
				 
					if (caseParams.get("caseId") && caseParams.get("caseId") != "") {
						this.hasCase = true
						this.backUrl = '/cases/cases/case-view/' + this.milestoneObject.caseId + '/milestones/milestone-details/' + this.milestoneObject.milestoneId
					}
					else
						this.backUrl = '/milestones/milestone-details/' + this.milestoneObject.milestoneId
				});
			});
		});
	}

	async loadMilestone(id) {
		try {
			let Response = await this.dataService.getallData(this.utility.baseUrl + "milestones?milestoneId" + "=" + id, true).toPromise();
			if (!Response) {
				swal("No Milestone exists for selected task")
				this.router.navigate([this.backUrl])
				return;
			}
			this.milestoneObject = JSON.parse(Response.toString())
		} catch (error) {
			swal("No Milestone exists for selected task")
			this.router.navigate([this.backUrl])
			return;
		}
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
