import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { ApiDataService } from '../users/api-data.service';
import { UtilityService } from '../users/utility.service';
import { UtilityServicedev } from '../../../utilitydev.service';
import { AccdetailsService } from '../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityServiceV2 } from 'src/app/utility-service-v2.service';
import prettyBytes from 'pretty-bytes';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	public messageArray: any[] = []
	public messageDataArray: any[] = []
	public messageAry: any[] = []
	public caseCount = 0;
	public caseinvitationCount = 0;
	public workworderCount = 0;
	public inboxCount = 0;
	upcomingMeetings = [];
	milestones = [];
	public storage: any = {};
	showNotification = false;

	module = 'patients';
	isLoadingData = true;
	data: any;
	shimmer = Array;
	dtOptions: DataTables.Settings = {};
	user = this.utility.getUserDetails()
	caseList: any;

	constructor(private dataService: ApiDataService, private http: HttpClient, public utility2: UtilityServiceV2, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private utilitydev: UtilityServicedev, private route: ActivatedRoute) {
	}

	ngOnInit(): void {

		this.dtOptions = {
			dom: '<"datatable-top"f>rt<"datatable-bottom"lip><"clear">',
			pagingType: 'full_numbers',
			pageLength: 10,
			processing: true,
			responsive: true,
			language: {
				search: " <div class='search'><i class='bx bx-search'></i> _INPUT_</div>",
				lengthMenu: "Items per page _MENU_",
				info: "_START_ - _END_ of _TOTAL_",
				paginate: {
					first: "<i class='bx bx-first-page'></i>",
					previous: "<i class='bx bx-chevron-left'></i>",
					next: "<i class='bx bx-chevron-right'></i>",
					last: "<i class='bx bx-last-page'></i>"
				},
			},
			columnDefs: [{
				"defaultContent": "-",
				"targets": "_all"
			}]
		};

		this.getThread(sessionStorage.getItem('loginResourceId'));
		this.getInviteListingReceived(sessionStorage.getItem('loginResourceId'));
		this.getUpcomingMeetings()
		this.getMilestoneAlerts()
		this.getStorageDetails()
		//this.getInviteListing(sessionStorage.getItem('loginResourceId'));
		this.loadPatients(true);
		this.utility2.getArrayObservable().subscribe(array => {
			if (array.some(el => el.module === this.module && el.isProcessed))
				this.loadPatients(true);
		});
	}

	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}

	async loadPatients(force = false) {
		if (!force && this.data) return;
		await this.utility2.loadPreFetchData("cases", true);
		await this.utility2.loadPreFetchData("patients", true);
		await this.utility2.loadPreFetchData("practices", true);
		this.data = this.utility2.metadata["patients"];
		this.isLoadingData = true;

		//apply default sorting and attach caselist
		this.data = this.data.sort((first, second) => {

			if (!first.hasOwnProperty("caseList"))
				first['caseList'] = this.utility2.metadata.cases.filter((item) => item.patientId == first.patientId);

			if (!second.hasOwnProperty("caseList"))
				second['caseList'] = this.utility2.metadata.cases.filter((item) => item.patientId == second.patientId);

			return 0 - (first.firstName > second.firstName ? -1 : 1);
		});

		//filter out inactive cases
		this.data = this.data.filter(item => (this.getCaseCount(item.caseList, true) > 0 || this.getCaseCount(item.caseList, false) == 0))

		//stupid library used-->fix required for no data label
		if (this.data.length > 0) {
			Array.from(document.getElementsByClassName('dataTables_empty')).forEach(element => {
				element.classList.add('d-none')
			});
		}
		this.isLoadingData = false;
	}

	getCaseCount(data, type) {
		let count = 0;
		if (!data) return count;
		data.forEach(element => {
			if (type) {
				if (!element["caseRunningStatus"] || element["caseRunningStatus"] <= 1) count = count + 1;
			}
			else
				if (element["caseRunningStatus"] > 1) count = count + 1
		});
		return count;
	}

	getInviteListingReceived(fromDate) {
		let user = this.usr.getUserDetails();
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?invitedUserMail=" + user.emailAddress;
		let toDate: Date = new Date();
		url += "&dateTo=" + toDate.getTime();
		if ((fromDate == 'undefined') || (fromDate == '') || (fromDate == null)) {
			url += "&dateFrom=" + toDate.getTime();
		}
		else {
			url += "&dateFrom=" + fromDate;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response) {
				let GetAllData = JSON.parse(Response.toString());
				for (var k = 0; k < GetAllData.length; k++) {
					this.caseinvitationCount++;
				}
			}
		}, error => {
			if (error.status)
				swal(error.error);
			else
				swal('Unable to fetch the data, please try again');
		});
	}

	getUpcomingMeetings() {
		let user = this.usr.getUserDetails();
		if (!user['cxId']) return;
		let cxDomain = 'https://dentallive.my3cx.ca:5001/webmeeting/api/v1';
		let cxAPI = "65n2D8eEVwCfcUUb3J5McsLAveZzgkqZRc1YyQo17lPnnMJL2j4TDhJM4RjwfH36";
		let headers = new HttpHeaders({
			'3CX-ApiKey': cxAPI,
			'Content-Type': 'application/json'
		});

		this.http.get(`${cxDomain}/meetings/list?extension=${user['cxId']}`, { headers: headers })
			.subscribe(Response => {
				if (Response['result']['scheduledMeetings']) {
					this.upcomingMeetings = Response['result']['scheduledMeetings'].filter(item => new Date(item.datetime).getTime() > Date.now())
				}
			}
			)
	}

	getMilestoneAlerts() {
		let user = this.usr.getUserDetails();
		let url = this.utility2.baseUrl + 'milestones';
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response) {
				let data = JSON.parse(Response.toString());
				if (data) {
					let limitDay = new Date()
					limitDay.setDate(limitDay.getDate() + 4);
					this.milestones = data.filter(item => new Date(item.duedate).getTime() > Date.now() && new Date(item.duedate).getTime() < limitDay.getTime())
				}
			}
		});
	}

	getStorageDetails() {
		let user = this.usr.getUserDetails();
		let url = this.utility.apiData.usage.ApiUrl + `?email=${user.emailAddress}&type=stats`
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response) {
				let data = JSON.parse(Response.toString());
				if (data) this.storage = data;
			}
		});
	}

	formatData(object) {
		let total = 0;
		if (object.used)
			total = object.used.meet + object.used.mail + object.used.planner;
		return prettyBytes(total);
	}

	getInviteListing(fromDate) {
		let user = this.usr.getUserDetails();
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?resourceOwner=" + user.emailAddress;
		let toDate: Date = new Date();
		url += "&dateTo=" + toDate.getTime();
		if ((fromDate == 'undefined') || (fromDate == '') || (fromDate == null)) {
			url += "&dateFrom=" + toDate.getTime();
		}
		else {
			url += "&dateFrom=" + fromDate;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response) {
				let GetAllData = JSON.parse(Response.toString());
				for (var k = 0; k < GetAllData.length; k++) {
					this.caseinvitationCount++;
				}
			}
		}, error => {
			if (error.status)
				swal(error.error);
			else
				swal('Unable to fetch the data, please try again');
		});
	}
	getThread(fromDate) {
		swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		});
		let user = this.usr.getUserDetails();
		if (user) {
			let url = this.utility.apiData.userThreads.ApiUrl;
			let toDate: Date = new Date();
			url += "?dateTo=" + toDate.getTime();
			if ((fromDate == 'undefined') || (fromDate == '') || (fromDate == null)) {
				url += "&dateFrom=" + toDate.getTime();
			}
			else {
				url += "&dateFrom=" + fromDate;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response) {
					swal.close();
					let treadAllData = JSON.parse(Response.toString());
					treadAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
					//this.inboxCount = treadAllData[0].mailCount ? treadAllData[0].mailCount : 0;
					this.messageDataArray = Array();
					for (var i = 0; i < treadAllData.length; i++) {
						let skVal = treadAllData[i].sk;
						if (skVal) {
							if (skVal.startsWith('DETAILS')) {
								this.caseCount++;
							}
							else if (skVal.startsWith('WORKORDERS')) {
								this.workworderCount++;
							}
							else if (skVal.startsWith('MILESTONES')) {
								this.messageDataArray.push({
									patientId: treadAllData[i].patientId,
									caseId: treadAllData[i].caseId,
									patientName: treadAllData[i].patientName,
									dateUpdated: treadAllData[i].dateUpdated,
									dateCreated: treadAllData[i].dateCreated,
									messageId: '',
									messagetext: treadAllData[i].title,
									messageimg: '',
									messagecomment: '',
									messagecomments: ''
								});
							}
						}
						if (treadAllData.length == (i + 1)) {
							this.messageAry = this.messageDataArray;
							this.messageAry.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
						}
					}
				}
			}, (error) => {
				if (error.status)
					swal(error.error);
				else
					swal('Unable to fetch the data, please try again');
				return false;
			});

		}
	}

	getStoragePercentage(object) {
		let total, used, percentage = 0;
		if (object.total)
			total = object.total * 1024 * 1024 * 1024
		if (object.used)
			used = object.used.meet + object.used.mail + object.used.planner;

		percentage = total == 0 ? 0 : used / total * 100
		return percentage == 0 ? 0 : Math.round(percentage);
	}
}
