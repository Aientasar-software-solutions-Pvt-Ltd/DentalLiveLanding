import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import {encode} from 'html-entities';
import {decode} from 'html-entities';


@Component({
  selector: 'app-general-task-edit',
  templateUrl: './general-task-edit.component.html',
  styleUrls: ['./general-task-edit.component.css']
})
export class GeneralTaskEditComponent implements OnInit {
  @ViewChild(Cvfast) cvfastval!: Cvfast;
 sending: boolean;
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
    selectedCity: any;
    selectedCityName: any[] = []
	public jsonObj = {
	  caseId: '',
	  patientId: '',
	  patientName: '',
	  title: '',
	  description: {},
	  startdate: 0,
	  duedate: 0,
	  presentStatus: 0,
	  reminder: 0,
	  memberMail: '',
	  memberName: '',
	  taskId: '',
	  milestoneId: ''
	}
	
	editdata:any;
	editedDate:any;
	editedstartDate:any;
	tabledata:any;
	editedTitle:any;
	public isvalidDate = false;
	public isvalidRefereTo = false;
	gettaskId: any;
	minDate = new Date();
    constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService, private route: ActivatedRoute) {
		this.gettaskId = this.route.snapshot.paramMap.get('taskId');
	}

  back(): void {
    this.location.back()
  }
  
	ngOnInit(): void {
		this.getEditTasks();
	}
	getuserdetailsall(userId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?emailAddress="+userId;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let avatar = ''
			if(userData.imageSrc != undefined)
			{
			avatar = 'https://dentallive-accounts.s3-us-west-2.amazonaws.com/'+userData.imageSrc;
			}
			else
			{
			avatar = 'assets/images/users.png';
			}
			let name = userData.accountfirstName+' '+userData.accountlastName;
			this.allMember[index].name = name;
			this.allMember[index].emailAddress = userData.emailAddress;
			this.allMember[index].avatar = avatar;
		}
		}, (error) => {
			if (error.status === 404)
			swal('No task found');
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
	getAllMembers(caseId) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			this.sending = true;
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			url += "&presentStatus="+1;
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					let GetAllData = JSON.parse(Response.toString());
					GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.allMember = Array();
					for(var k = 0; k < GetAllData.length; k++)
					{
						this.allMember.push({
						  id: k,
						  avatar: '',
						  emailAddress: '',
						  name: ''
						});
						this.getuserdetailsall(GetAllData[k].invitedUserMail,k);
					}
					this.sending = false;
				}
			}, error => {
				if (error.status === 404)
				swal('No task found');
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
	selectEvent(item: any) {
		this.allMemberEmail = Array();
		this.allMemberName = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].emailAddress);
			this.allMemberName.push(item[k].name);
			this.isvalidRefereTo = false;
		}
	}
	onSubmitTask(form: NgForm){
		if(Date.parse(form.value.startdate) >= Date.parse(form.value.dueDatetime))
		{
			this.isvalidDate =true;
		}
		else
		{
			this.isvalidDate =false;
		}
		if(this.allMemberEmail.length == 0)
		{
			this.isvalidRefereTo =true;
		}
		else
		{
			this.isvalidRefereTo =false;
		}
		if ((form.invalid) || (this.isvalidDate == true) || (this.isvalidRefereTo == true)) {
		  swal("Please enter values for the mandatory fields");
		  form.form.markAllAsTouched();
		  return;
		}
		this.sending = true;
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		this.jsonObj['patientName'] = data.patientname;
		this.jsonObj['title'] = this.removeHTML(data.title);
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['duedate'] = Date.parse(data.dueDatetime);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['reminder'] = Number(data.reminder);
		this.jsonObj['taskId'] = data.taskId;
		let meberEmail = this.allMemberEmail.join(', ');
		let meberName = this.allMemberName.join(', ');
		this.jsonObj['memberMail'] = meberEmail;
		this.jsonObj['memberName'] = meberName;
		this.jsonObj['milestoneId'] = data.milestoneId;
		
		
		this.cvfastval.processFiles(this.utility.apiData.userTasks.ApiUrl, this.jsonObj, true, 'Task Updated successfully', 'milestones/milestone-details/'+data.milestoneId, 'put', '','description','','Task title already exists.').then(
		(value) => {
		this.sending = false;
		},
		(error) => {
		this.sending = false;
		});
		
	}
	
	getCaseDetails(caseId) {
		this.tabledata = '';
		let url = this.utility.apiData.userCases.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
			}
		}, error => {
			if (error.status === 404)
			swal('No task found');
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
	setcvFast()
	{
		this.cvfastval.setCvfast(this.editdata.description);
		setTimeout(()=>{    
			this.selectedCity = this.selectedCityName; 
		}, 1000);
	}
	userdetailsall(obj: any) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		for(var k = 0; k < obj.length; k++)
		{
			let apiUrl = this.utility.apiData.userColleague.ApiUrl;
			apiUrl += "?emailAddress="+obj[k].trim();
			this.dataService.getallData(apiUrl, true).subscribe(Response => {
			if (Response)
			{
				let userData = JSON.parse(Response.toString());
				let name = userData.accountfirstName+' '+userData.accountlastName;
				this.selectedCityName.push(name);
			}
			}, (error) => {
				if (error.status === 404)
				swal('No workorder found');
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
	getEditTasks() {
		let url = this.utility.apiData.userTasks.ApiUrl;
		let taskId = this.gettaskId;
		if(taskId != '')
		{
			url += "?taskId="+taskId;
		}
		
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.editdata = JSON.parse(Response.toString());
				this.allMemberEmail = this.editdata.memberMail.split(",");
				this.userdetailsall(this.allMemberEmail);
				this.allMemberName = this.editdata.memberName.split(",");
				this.getAllMembers(this.editdata.caseId);
				this.getCaseDetails(this.editdata.caseId);
				this.editedDate = new Date(this.editdata.duedate);
				this.editedstartDate = new Date(this.editdata.startdate);
				this.editedTitle = decode(this.editdata.title);
				setTimeout(()=>{    
					this.setcvFast();
				}, 2000);
			}
		}, error => {
			if (error.status === 404)
			swal('No task found');
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
	
	removeHTML(str){ 
		if((str != '') && (str != 'undefined') && (str != undefined))
		{
		var tmp = document.createElement("DIV");
		tmp.innerHTML = str;
		return tmp.textContent || tmp.innerText || "";
		}
		else
		{
		return "";
		}
	}
}
