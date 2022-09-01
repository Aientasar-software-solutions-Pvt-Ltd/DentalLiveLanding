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
	constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev, private route: ActivatedRoute) { 
	}

	ngOnInit(): void {
	this.getThread();
	}
	getThread() {
		swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		});
		
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userThreads.ApiUrl;
			let toDate: Date = new Date();
			let fromDate: Date = new Date();
			url += "?dateTo="+toDate.getTime();
			url += "&dateFrom="+fromDate.getTime();
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
						if(skarray[0] == 'MESSAGES')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].patientName,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: treadAllData[i].messageId,
								messagetext: treadAllData[i].message.text,
								messageimg: '',
								messagecomment: treadAllData[i].comments,
								messagecomments: ''
							});
						}
						else if(skarray[0] == 'CASEINVITES')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].patientName,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'CASEINVITES#  : '+treadAllData[i].invitationText.text,
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
						}
						else if(skarray[0] == 'DETAILS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].patientName,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'DETAILS#  : '+treadAllData[i].title,
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
						}
						else if(skarray[0] == 'WORKORDERS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].patientName,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'WORKORDERS#  : '+treadAllData[i].title,
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
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
								messagetext: 'MILESTONES#  : '+treadAllData[i].title,
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
						}
						else if(skarray[0] == 'REFERRALS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].patientName,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'REFERRALS#  : '+treadAllData[i].title,
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
						}
						else if(skarray[0] == 'TASKS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].patientName,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'TASKS#  : '+treadAllData[i].title,
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
						}
						else if(skarray[0] == 'FILES')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].patientName,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'Files Uploaded',
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
