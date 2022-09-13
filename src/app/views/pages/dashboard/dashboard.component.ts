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
	this.getThread(sessionStorage.getItem('loginResourceId'));
	this.getInviteListingReceived(sessionStorage.getItem('loginResourceId'));
	this.getInviteListing(sessionStorage.getItem('loginResourceId'));
	}
	getInviteListingReceived(fromDate) {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?invitedUserMail="+user.emailAddress;
		let toDate: Date = new Date();
		url += "&dateTo="+toDate.getTime();
		url += "&dateFrom="+fromDate;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.caseinvitationCount++;
				}
				//alert(JSON.stringify(GetAllData));
			}
		}, error => {
		  if (error.status === 404)
			swal('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			swal('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			swal('Wrong Password,please try again');
		  else if (error.status === 401)
			swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			swal(error.error);
		  else
			swal('Unable to fetch the data, please try again');
		});
	}
	getInviteListing(fromDate) {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		url += "?resourceOwner="+user.emailAddress;
		let toDate: Date = new Date();
		url += "&dateTo="+toDate.getTime();
		url += "&dateFrom="+fromDate;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.caseinvitationCount++;
				}
				//alert(JSON.stringify(GetAllData));
			}
		}, error => {
		  if (error.status === 404)
			swal('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			swal('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			swal('Wrong Password,please try again');
		  else if (error.status === 401)
			swal('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
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
