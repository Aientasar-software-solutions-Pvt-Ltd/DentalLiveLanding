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
	user = this.utility.getUserDetails()
	taskList = [];

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
				if (params.get("hasTask")) this.tab = 0
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

	async changeStatus(e) {
		try {
			let result = await swal('Do you want to change the staus of the Referral?', {
				buttons: ["No", "Yes,Update Status"],
			})
			if (!result) {
				e.target.value = this.baseData.presentStatus;
				return;
			}
			this.baseData.presentStatus = parseInt(e.target.value)
			swal("Processing request...please wait...", {
				buttons: [false, false],
				closeOnClickOutside: false,
			});
			let url = this.utility.baseUrl + this.module;
			if (this.id) url = url + "?" + this.section.keyName + "=" + this.id
			try {
				await this.dataService
					.putData(url, JSON.stringify(this.baseData), true).toPromise();
				swal("Status Updated");
			} catch (error) {
				console.log(error)
				swal("Unable To Update, Please Try Again");
			}
		} catch (error) {
			swal.close();
			(error['status']) ? this.utility.showError(error['status']) : swal("Error processing request,please try again");
			return;
		}
	}

	getCompletionPercentage() {
		if (this.taskList.length == 0) return 0 + "%";
		let tasks = this.getActiveTasks();
		let completed = this.getCompletedTasks();
		let dueTasks = this.getOverDueTasks();
		if (tasks == 0 && dueTasks == 0) return 100 + "%"
		if (tasks && completed) return ((completed / (tasks + completed + dueTasks)) * 100).toFixed() + '%'
		else return 0 + "%"
	}
	getActiveTasks() {
		let tasks = this.taskList.filter(function (itm) {
			return itm.presentStatus == 1 && itm.duedate > Date.now();
		});
		return tasks.length
	}
	getOverDueTasks() {
		let tasks = this.taskList.filter(function (itm) {
			return itm.presentStatus != 3 && itm.duedate < Date.now();
		});
		return tasks.length
	}
	getCompletedTasks() {
		let tasks = this.taskList.filter(function (itm) {
			return itm.presentStatus == 3;
		});
		return tasks.length
	}
	updateTaskList(e) {
		this.taskList = [...e]
	}
}
