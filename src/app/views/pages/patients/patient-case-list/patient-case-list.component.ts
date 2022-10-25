//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-case-list',
  templateUrl: './patient-case-list.component.html',
  styleUrls: ['./patient-case-list.component.css']
})
export class PatientCaseListComponent implements OnInit {
  isLoadingData = true;

  casedata:any;
  tabledata:any;
  dtOptions: DataTables.Settings = {};
  paramPatientId: any;
  invitedatas:any;
  userDeatils:any;
  allMember:any;
  shimmer = Array;
  public indexRow = 0;
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private route: ActivatedRoute) {
	this.paramPatientId = this.route.snapshot.paramMap.get('patientId');
  }

  ngOnInit(): void {
	this.userDeatils = this.usr.getUserDetails(false);
	this.getallpatiant();
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
	  columnDefs: [{
		"defaultContent": "-",
		"targets": "_all"
	  }]
	};
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	viewCase(caseId: any, patientId: any) {
		this.router.navigate(['master/master-list/'+caseId+'/caseDetails']);
	}
	
	getallpatiant() {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userPatients.ApiUrl;
		let patientId = this.paramPatientId;
		if(patientId != '')
		{
			url += "?patientId="+patientId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
				if((this.tabledata.resourceOwner == user.emailAddress))
				{
					this.getallcase();
				}
				else
				{
					this.getAllMembers();
				}
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
	}
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			let patientId = this.paramPatientId;
			if(patientId != '')
			{
				url += "?patientId="+patientId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let casedataResult = JSON.parse(Response.toString());
					casedataResult.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					
					this.casedata = Array();
					for(var k = 0; k < casedataResult.length; k++)
					{
						this.casedata.push({
						  id: k,
						  patientName: casedataResult[k].patientName,
						  title: casedataResult[k].title,
						  caseStatus: casedataResult[k].caseStatus,
						  dateCreated: casedataResult[k].dateCreated,
						  memberName: '',
						  patientId: casedataResult[k].patientId,
						  caseId: casedataResult[k].caseId
						});
						this.getCaseMemberList(casedataResult[k].caseId,k,1);
					}
				
				}
			}, (error) => {
				if (error.status === 404)
				swal('No patient found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered for first name or last name');
				else if (error.status === 405)
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
		}
	}
	
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			
			url += "?invitedUserMail="+user.emailAddress;
			url += "&presentStatus=1";
			let patientId = this.paramPatientId;
			if(patientId != '')
			{
				url += "&patientId="+patientId;
			}
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.allMember = JSON.parse(Response.toString());
					this.allMember.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.getColleaguesCase();
				}
			}, error => {
				if (error.status === 404)
				swal('No case found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered');
				else if (error.status === 405)
				swal({
				text: 'Due to dependency data unable to complete operation'
				}).then(function() {
				window.location.reload();
				});
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			});
		}
	}
	
	getColleaguesCase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			this.casedata = Array();	
			for(var k=0; k < this.allMember.length; k++)
			{
				let url1 = this.utility.apiData.userCases.ApiUrl;
				url1 += "?caseId="+this.allMember[k].caseId;
				this.dataService.getallData(url1, true).subscribe(Response => {
					if (Response)
					{
						let AllDate = JSON.parse(Response.toString());
						this.casedata.push({
						  patientName: AllDate.patientName,
						  title: AllDate.title,
						  caseStatus: AllDate.caseStatus,
						  dateCreated: AllDate.dateCreated,
						  memberName: '',
						  patientId: AllDate.patientId,
						  caseId: AllDate.caseId
						});
						this.getCaseMemberList(AllDate.caseId,(k-1),2);
					}
				}, (error) => {
					if (error.status === 404)
					swal('No case found');
					else if (error.status === 403)
					swal('You are unauthorized to access the data');
					else if (error.status === 400)
					swal('Invalid data provided, please try again');
					else if (error.status === 401)
					swal('You are unauthorized to access the page');
					else if (error.status === 409)
					swal('Duplicate data entered');
					else if (error.status === 405)
					swal({
					text: 'Due to dependency data unable to complete operation'
					}).then(function() {
					window.location.reload();
					});
					else if (error.status === 500)
					swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
					else
					swal('Oops something went wrong, please try again');		
					return false;
				});
			}
		}
	}
	getCaseMemberList(caseId, index, type) {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		url += "&presentStatus=1";
		if(type == 1)
		{
		url += "&resourceOwner="+user.emailAddress;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				if(GetAllData.length == 0)
				{
				this.isLoadingData = false;
				}
				GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				this.invitedatas = Array();
				this.indexRow = 0;
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedatas.push({
					  id: this.indexRow,
					  userName: ''
					});
					this.getuserdetailsall(GetAllData[k].invitedUserId,this.indexRow,index);
					this.indexRow++;
				} 
			}
		}, error => {
			this.isLoadingData = false;
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
	}
	
	getuserdetailsall(userId, index, Row) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?dentalId="+userId;
		}
		let GetArray = this.invitedatas;
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			GetArray[index].userName = name;
			if((index+1) == GetArray.length)
			{
				this.casedata[Row].memberName = GetArray;
				this.isLoadingData = false;
			}
		}
		}, (error) => {
			this.isLoadingData = false;
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		  return false;
		});
		}
	}
}
