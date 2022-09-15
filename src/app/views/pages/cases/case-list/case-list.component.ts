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

	isLoadingData = true;
	masterSelected:boolean;
	tabledata:any;
	allMember:any;
	colleaguesdata:any;
	shimmer = Array;
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
			/* swal("Processing...please wait...", {
			  buttons: [false, false],
			  closeOnClickOutside: false,
			}); */
			let url = this.utility.apiData.userCases.ApiUrl;
			//url += "?resourceOwner="+user.emailAddress;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					let AllDate = JSON.parse(Response.toString());
					//let caseDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
					AllDate.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					//this.tabledata = caseDate.reverse();
					//alert(JSON.stringify(AllDate));
					this.isLoadingData = false;
					this.tabledata = Array();
					this.colleaguesdata = Array();
					var j = 0;
					var l = 0;
					for(var k = 0; k < AllDate.length; k++)
					{
						if(user.emailAddress == AllDate[k].resourceOwner)
						{
							this.tabledata.push({
							  id: j,
							  patientName: AllDate[k].patientName,
							  title: AllDate[k].title,
							  caseStatus: AllDate[k].caseStatus,
							  dateCreated: AllDate[k].dateCreated,
							  memberName: '',
							  patientId: AllDate[k].patientId,
							  caseId: AllDate[k].caseId
							});
							this.getCaseMemberList(AllDate[k].caseId,j,1);
							j++;
						}
						else
						{
							this.colleaguesdata.push({
							  id: l,
							  patientName: AllDate[k].patientName,
							  title: AllDate[k].title,
							  caseStatus: AllDate[k].caseStatus,
							  dateCreated: AllDate[k].dateCreated,
							  memberName: '',
							  patientId: AllDate[k].patientId,
							  caseId: AllDate[k].caseId
							});
							this.getCaseMemberList(AllDate[k].caseId,l,0);
							l++;
						}
					}
					//this.getAllMembers();
					
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
				if (error.status)
				swal(error.error);
				else
				swal('Unable to fetch the data, please try again');			});
	};
	  
	getCaseMemberList(caseId, index, type) {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		url += "&resourceOwner="+user.emailAddress;
		url += "&presentStatus=1";
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
					//alert(GetAllData[k].invitedUserMail);
					this.getuserdetailsall(GetAllData[k].invitedUserMail,this.indexRow,index,type);
					this.indexRow++;
				} 
				//alert(JSON.stringify(this.invitedata));
				//alert(JSON.stringify(this.tabledata));
			}
		}, error => {
			if (error.status)
			swal(error.error);
			else
			swal('Unable to fetch the data, please try again');
		});
	}
	
	getuserdetailsall(userId, index, Row,type) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?emailAddress="+userId;
		}
		let GetArray = this.invitedatas;
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			//swal.close();
			let userData = JSON.parse(Response.toString());
			let name = userData.accountfirstName+' '+userData.accountlastName;
			GetArray[index].userName = name;
			if((index+1) == GetArray.length)
			{
				if(type == 1)
				{
				this.tabledata[Row].memberName = GetArray;
				}
				else
				{
				this.colleaguesdata[Row].memberName = GetArray;
				}
				//alert(JSON.stringify(this.tabledata[Row].memberName));
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
	
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			
			//url += "&invitedUserId="+user.dentalId;
			url += "?invitedUserMail="+user.emailAddress;
			url += "&presentStatus=1";
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.allMember = JSON.parse(Response.toString());
					this.allMember.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					//alert(JSON.stringify(this.allMember));
					this.getColleaguesCase();
					//alert(JSON.stringify(this.allMember));
				}
			}, error => {
				if (error.status)
				swal(error.error);
				else
				swal('Unable to fetch the data, please try again');
			});
		}
	}
	
	getColleaguesCase() {
		//alert(JSON.stringify(this.allMember));
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			this.colleaguesdata = Array();	
			for(var k=0; k < this.allMember.length; k++)
			{
				let url1 = this.utility.apiData.userCases.ApiUrl;
					url1 += "?caseId="+this.allMember[k].caseId;
					this.dataService.getallData(url1, true).subscribe(Response => {
						if (Response)
						{
							let AllDate = JSON.parse(Response.toString());
							this.colleaguesdata.push({
							  patientName: AllDate.patientName,
							  title: AllDate.title,
							  caseStatus: AllDate.caseStatus,
							  dateCreated: AllDate.dateCreated,
							  memberName: '',
							  patientId: AllDate.patientId,
							  caseId: AllDate.caseId
							});
						}
					}, (error) => {
						if (error.status)
						swal(error.error);
						else
						swal('Unable to fetch the data, please try again');				  return false;
				});
			}
			//alert(JSON.stringify(this.colleaguesdata));
		}
	}
}