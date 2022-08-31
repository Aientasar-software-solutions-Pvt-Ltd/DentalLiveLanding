//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { NgForm } from '@angular/forms';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent implements OnInit {

	masterSelected:boolean;
	tabledata:any;
	colleaguesdata:any;
	public indexRow = 0;
	checkedList:any;
	invitedatas:any;
  
	id:any = "myCases";
	tabContent(ids:any){
		this.id = ids;
	}
	
	dtOptions: DataTables.Settings = {};
  constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }

  ngOnInit(): void {
  sessionStorage.setItem('checkPatient', '');
  sessionStorage.setItem('patientId', '');
  this.getallcase();
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
		}
    };
  }
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			swal("Processing...please wait...", {
			  buttons: [false, false],
			  closeOnClickOutside: false,
			});
			let url = this.utility.apiData.userCases.ApiUrl;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					swal.close();
					let AllDate = JSON.parse(Response.toString());
					//let caseDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
					AllDate.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					//this.tabledata = caseDate.reverse();
					
					this.tabledata = Array();
					for(var k = 0; k < AllDate.length; k++)
					{
						this.tabledata.push({
						  id: k,
						  patientName: AllDate[k].patientName,
						  title: AllDate[k].title,
						  caseStatus: AllDate[k].caseStatus,
						  dateCreated: AllDate[k].dateCreated,
						  memberName: '',
						  patientId: AllDate[k].patientId,
						  caseId: AllDate[k].caseId
						});
						this.getCaseMemberList(AllDate[k].caseId,k);
					}
					//alert(JSON.stringify(this.tabledata));
				
				}
			}, (error) => {
			  swal('Unable to fetch data, please try again');
			  return false;
			});
		}
	}
	
	viewCase(caseId: any, patientId: any) {
		this.router.navigate(['master/master-list/'+caseId+'/caseDetails']);
	}
	onSubmit(form: NgForm) {
		let url = this.utility.apiData.userCases.ApiUrl;
		let patientName = form.value.patientName;
		if(patientName != '')
		{
			url += "?patientName="+patientName;
		}
		if(form.value.title != '')
		{
			if(patientName != '')
			{ 
				url += "&title="+form.value.title;
			}
			else
			{
				url += "?title="+form.value.title;
			}
		}
		if(form.value.dateFrom != '')
		{
			if(patientName != '' || form.value.title != '')
			{ 
				url += "&dateFrom="+Date.parse(form.value.dateFrom);
			}
			else
			{
				url += "?dateFrom="+Date.parse(form.value.dateFrom);
			}
		}
		if(form.value.dateTo != '')
		{
			if(patientName != '' || form.value.dateFrom != '' || form.value.title != '')
			{
				url += "&dateTo="+Date.parse(form.value.dateTo);
			}
			else
			{
				url += "?dateTo="+Date.parse(form.value.dateTo);
			}
		}
		this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString()).reverse();
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
	};
	  
	getCaseMemberList(caseId, index) {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		url += "&resourceOwner="+user.dentalId;
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				//alert(JSON.stringify(GetAllData));
				this.invitedatas = Array();
				this.indexRow = 0;
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedatas.push({
					  id: this.indexRow,
					  userName: ''
					});
					//alert(GetAllData[k].invitedUserId);
					this.getuserdetailsall(GetAllData[k].invitedUserId,this.indexRow,index);
					this.indexRow++;
				} 
				//alert(JSON.stringify(this.invitedata));
				//alert(JSON.stringify(this.tabledata));
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
			swal.close();
			let userData = JSON.parse(Response.toString());
			//alert(JSON.stringify(GetArray));
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			GetArray[index].userName = name;
			if((index+1) == GetArray.length)
			{
				this.tabledata[Row].memberName = GetArray;
				//alert(JSON.stringify(this.tabledata[Row].memberName));
			}
		}
		}, (error) => {
			swal({title: 'Unable to fetch data, please try again'});
			return false;
		});
		}
	}
	
	
	
	getColleaguesCase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			swal("Processing...please wait...", {
			  buttons: [false, false],
			  closeOnClickOutside: false,
			});
			let url = this.utility.apiData.userCases.ApiUrl;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let AllDate = JSON.parse(Response.toString());
					AllDate.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					
					this.colleaguesdata = Array();
					for(var k = 0; k < AllDate.length; k++)
					{
						this.colleaguesdata.push({
						  id: k,
						  patientName: AllDate[k].patientName,
						  title: AllDate[k].title,
						  caseStatus: AllDate[k].caseStatus,
						  dateCreated: AllDate[k].dateCreated,
						  memberName: '',
						  patientId: AllDate[k].patientId,
						  caseId: AllDate[k].caseId
						});
						this.getCaseMemberListColleague(AllDate[k].caseId,k);
					}
					//alert(JSON.stringify(this.colleaguesdata));
				}
			}, (error) => {
			  swal({title: 'Unable to fetch data, please try again'});
			  return false;
			});
		}
	}
	
	getCaseMemberListColleague(caseId, index) {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		url += "&resourceOwner="+user.dentalId;
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				//alert(JSON.stringify(GetAllData));
				this.invitedatas = Array();
				this.indexRow = 0;
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedatas.push({
					  id: this.indexRow,
					  userName: ''
					});
					//alert(GetAllData[k].invitedUserId);
					this.getuserdetailsallcolleague(GetAllData[k].invitedUserId,this.indexRow,index);
					this.indexRow++;
				} 
				//alert(JSON.stringify(this.invitedata));
				//alert(JSON.stringify(this.tabledata));
			}
		}, error => {
		  if (error.status === 404)
			swal({title: 'E-Mail ID does not exists,please signup to continue'});
		  else if (error.status === 403)
			swal({title: 'Account Disabled,contact Dental-Live'});
		  else if (error.status === 400)
			swal({title: 'Wrong Password,please try again'});
		  else if (error.status === 401)
			swal({title: 'Account Not Verified,Please activate the account from the Email sent to the Email address.'});
		  else if (error.status === 428)
			swal({title: error.error});
		  else
			swal({title: 'Unable to fetch the data, please try again'});
		});
	}
	
	getuserdetailsallcolleague(userId, index, Row) {
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
			swal.close();
			let userData = JSON.parse(Response.toString());
			//alert(JSON.stringify(GetArray));
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			GetArray[index].userName = name;
			if((index+1) == GetArray.length)
			{
				this.colleaguesdata[Row].memberName = GetArray;
				//alert(JSON.stringify(this.colleaguesdata[Row].memberName));
			}
		}
		}, (error) => {
			swal({title: 'Unable to fetch data, please try again'});
			return false;
		});
		}
	}
}
