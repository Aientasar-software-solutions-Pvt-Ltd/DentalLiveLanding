import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { ApiDataService } from '../users/api-data.service';
import { UtilityService } from '../users/utility.service';
import { UtilityServicedev } from '../../../utilitydev.service';
import { AccdetailsService } from '../accdetails.service';
import { Router, ActivatedRoute  } from '@angular/router';
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
	public inboxCount = 15;
	constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev, private route: ActivatedRoute) { 
	}

	ngOnInit(): void {
	this.getLoginDeatils();
	}
	getLoginDeatils() {
		swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		});
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userLogin.ApiUrl;
			let loginResourceId = localStorage.getItem('loginResourceId');
			url += "?emailAddress="+loginResourceId;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					swal.close();
					let treadAllData = JSON.parse(Response.toString());
					//alert(JSON.stringify(treadAllData));
					this.getThread(treadAllData.lastLoggedIn);
				}
			}, (error) => {
			  swal("Unable to fetch data, please try again");
			  return false;
			});
			
		}
	}
	getThread(fromDate) {
		swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		});
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userThreads.ApiUrl;
			let toDate: Date = new Date();
			url += "?dateTo="+toDate.getTime();
			url += "&dateFrom="+fromDate;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					swal.close();
					let treadAllData = JSON.parse(Response.toString());
					treadAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
					//alert(JSON.stringify(treadAllData));
					
					this.messageDataArray = Array();
					for(var i = 0; i < treadAllData.length; i++)
					{
						let skVal = treadAllData[i].sk;
						var skarray = skVal.split("#"); 
						//alert(skarray[0]);
						if(skarray[0] == 'DETAILS')
						{
							this.caseCount++;
						}
						else if(skarray[0] == 'CASEINVITES')
						{
							this.caseinvitationCount++;
						}
						else if(skarray[0] == 'WORKORDERS')
						{
							this.workworderCount++;
						}
						else if(skarray[0] == 'MILESTONES')
						{
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
					
					setTimeout(()=>{   
						this.messageAry = this.messageDataArray;
						this.messageAry.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
						//alert(JSON.stringify(this.messageAry));
					}, 1000);
				}
			}, (error) => {
			  swal("Unable to fetch data, please try again");
			  return false;
			});
			
		}
	}
}
