//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-colleague-view-profile',
  templateUrl: './colleague-view-profile.component.html',
  styleUrls: ['./colleague-view-profile.component.css']
})
export class ColleagueViewProfileComponent implements OnInit {

	
	public jsonObj = {
	  colleagueId: ''
	}
	dtOptions: DataTables.Settings = {};
	masterSelected:boolean;
	detailsdata:any;
	colleaguedata:any;
	invitedata: any;
	inviteReceivedData: any;
	
	
	profileId: any;
	caseId: any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private route: ActivatedRoute) {
	this.masterSelected = false; 
	this.profileId = this.route.snapshot.paramMap.get('profileId');
	this.caseId = this.route.snapshot.paramMap.get('caseId');
	}
	
	back(): void {
		this.location.back()
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
				first : "<i class='bx bx-first-page'></i>",
				previous: "<i class='bx bx-chevron-left'></i>",
				next: "<i class='bx bx-chevron-right'></i>",
				last : "<i class='bx bx-last-page'></i>"
				},
		  },
		   
		};
		$('a[data-bs-toggle="tab"]').on('click', function(e:any){
			var target = $(e.target).attr("href"); // activated tab
			$($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
		});
		this.getColleagueDetails();
		this.getCaseDetail();
	}
  
	getColleagueDetails() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			swal("Processing...please wait...", {
			  buttons: [false, false],
			  closeOnClickOutside: false,
			});
			let user = this.usr.getUserDetails(false);
			//alert(user.dentalId);
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			url += "?resourceOwner="+user.dentalId;
			//url += "&presentStatus=1";
			var colleagueId = this.profileId;
			url += "&invitedUserId="+colleagueId;
			//alert(url);
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					swal.close();
					//alert(JSON.stringify(Response.toString()));
					let GetAllData = JSON.parse(Response.toString());
					GetAllData.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					this.invitedata = Array();
					for(var k = 0; k < GetAllData.length; k++)
					{
						this.invitedata.push({
						  id: k,
						  patientId: GetAllData[k].patientId,
						  invitedUserId: GetAllData[k].invitedUserId,
						  invitedUserMail: GetAllData[k].invitedUserMail,
						  invitationId: GetAllData[k].invitationId,
						  userName: '',
						  presentStatus: GetAllData[k].presentStatus,
						  invitationText: GetAllData[k].invitationText,
						  patientName: GetAllData[k].patientName,
						  caseId: GetAllData[k].caseId,
						  dateUpdated: GetAllData[k].dateUpdated,
						  dateCreated: GetAllData[k].dateCreated,
						  resourceOwner: GetAllData[k].resourceOwner,
						  dentalId: user.dentalId,
						  caseTitle: ''
						});
						this.getuserdetailsall(GetAllData[k].invitedUserId,k);
						this.getcasedetails(GetAllData[k].caseId,k);
					}
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
	}
	getuserdetailsall(userId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?dentalId="+userId;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			this.invitedata[index].userName = name;
			//this.inviteReceivedData[index].userName = name;
			//alert(JSON.stringify(this.inviteReceivedData));
		}
		}, (error) => {
		  swal( 'Unable to fetch data, please try again');
		  return false;
		});
		}
	}
	getcasedetails(caseId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				let caseData = JSON.parse(Response.toString());
				this.invitedata[index].caseTitle = caseData.title;
				this.inviteReceivedData[index].caseTitle = caseData.title;
				//alert(JSON.stringify(this.invitedata));
			}
			}, (error) => {
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
		}
	}
  
	getCaseDetail() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			swal("Processing...please wait...", {
			  buttons: [false, false],
			  closeOnClickOutside: false,
			});
			let url = this.utility.apiData.userCases.ApiUrl;
			
			let caseId = this.caseId;
			
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					swal.close();
					this.detailsdata = JSON.parse(Response.toString());
					//alert(JSON.stringify(this.detailsdata));
				}
			}, (error) => {
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
		}
	}

}
