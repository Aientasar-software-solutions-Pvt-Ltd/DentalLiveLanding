import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import {encode} from 'html-entities';

@Component({
  selector: 'app-general-task-add',
  templateUrl: './general-task-add.component.html',
  styleUrls: ['./general-task-add.component.css']
})
export class GeneralTaskAddComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
    selectedCity = '';
	public module = 'patient';
	
	defaultBindingsList = [
        { value: 1, label: 'Jhone Duo' },
        { value: 2, label: 'Danel Gray' },
        { value: 3, label: 'Pavilnys' }
    ];
	selectedMember: any;
	public isvalidDate = false;
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
	  milestoneId: '',
	}
	tabledata:any;
	milestoneIdadd:any;
	invitedata:any;
	
    constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService) { }

  back(): void {
    this.location.back()
  }
  
	ngOnInit(): void {
		this.selectedMember = this.defaultBindingsList[0];
		this.getCaseDetails();
		this.getAllMembers();
		this.milestoneIdadd = localStorage.getItem("milestoneId");
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
			avatar = '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x';
			}
			let name = userData.accountfirstName+' '+userData.accountlastName;
			this.allMember[index].name = name;
			this.allMember[index].emailAddress = userData.emailAddress;
			this.allMember[index].avatar = avatar;
			//alert(JSON.stringify(this.invitedata));
		}
		}, (error) => {
		  swal("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			let caseId = localStorage.getItem("caseId");
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			//url += "&invitedUserId="+user.dentalId;
			//url += "?resourceOwner="+user.dentalId;
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
	selectEvent(item: any) {
		this.allMemberEmail = Array();
		this.allMemberName = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].emailAddress);
			this.allMemberName.push(item[k].name);
		}
		//alert(JSON.stringify(this.allMemberEmail));
		//alert(JSON.stringify(this.allMemberName));
	}
	onSubmitTask(form: NgForm){
		//alert(JSON.stringify(form.value));
		let meberEmail = this.allMemberEmail.join(', ');
		let meberName = this.allMemberName.join(', ');
		if(meberEmail)
		{
			
		}
		else
		{
			
		}
		if(Date.parse(form.value.startdate) >= Date.parse(form.value.dueDatetime))
		{
			this.isvalidDate =true;
		}
		else
		{
			this.isvalidDate =false;
		}
		if ((form.invalid) || (this.isvalidDate == true)) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.onGetdateData(form.value);
	}
	onGetdateData(data: any)
	{
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		this.jsonObj['patientName'] = data.patientname;
		this.jsonObj['title'] = encode(data.title);
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
		this.jsonObj['description'] = this.cvfastval.returnCvfast();
		}
		//this.jsonObj['description'] = data.description;
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['duedate'] = Date.parse(data.dueDatetime);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['reminder'] = Number(data.reminder);
		let meberEmail = this.allMemberEmail.join(', ');
		let meberName = this.allMemberName.join(', ');
		this.jsonObj['memberMail'] = meberEmail;
		this.jsonObj['memberName'] = meberName;
		this.jsonObj['milestoneId'] = this.milestoneIdadd;
		
		//alert(JSON.stringify(this.jsonObj));
		
		this.cvfastval.processFiles(this.utility.apiData.userTasks.ApiUrl, this.jsonObj, true, 'Task added successfully', 'milestones/milestone-details', 'post', '','description');
	}
	
	getCaseDetails() {
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = localStorage.getItem("caseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
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

}