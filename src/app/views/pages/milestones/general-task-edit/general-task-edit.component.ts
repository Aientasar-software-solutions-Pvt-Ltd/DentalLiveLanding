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
    selectedCity = '';
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
	gettaskId: any;
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
			avatar = '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x';
			}
			let name = userData.accountfirstName+' '+userData.accountlastName;
			this.allMember[index].name = name;
			this.allMember[index].emailAddress = userData.emailAddress;
			this.allMember[index].avatar = avatar;
			//this.selectEvent(this.allMember);
			//alert(JSON.stringify(this.invitedata));
		}
		}, (error) => {
		  swal("Unable to fetch data, please try again");
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
					this.sending = false;
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
		//alert(JSON.stringify(item));
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].emailAddress);
			this.allMemberName.push(item[k].name);
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
		if ((form.invalid) || (this.isvalidDate == true)) {
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
		this.jsonObj['taskId'] = data.taskId;
		let meberEmail = this.allMemberEmail.join(', ');
		let meberName = this.allMemberName.join(', ');
		this.jsonObj['memberMail'] = meberEmail;
		this.jsonObj['memberName'] = meberName;
		this.jsonObj['milestoneId'] = data.milestoneId;
		
		//alert(JSON.stringify(this.jsonObj));
		
		this.cvfastval.processFiles(this.utility.apiData.userTasks.ApiUrl, this.jsonObj, true, 'Task Updated successfully', 'milestones/milestone-details/'+data.milestoneId, 'put', '','description');
		
	}
	
	getCaseDetails(caseId) {
		let url = this.utility.apiData.userCases.ApiUrl;
		//let caseId = localStorage.getItem("caseId");
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
	setcvFast()
	{
		//alert(JSON.stringify(this.editdata.description));
		this.cvfastval.setCvfast(this.editdata.description);
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
				//alert(JSON.stringify(this.editdata.memberMail));
				
				//alert(JSON.stringify(this.allMember));
				//this.selectedCity = 'chita';
				this.getAllMembers(this.editdata.caseId);
				this.getCaseDetails(this.editdata.caseId);
				this.editedDate = new Date(this.editdata.duedate);
				this.allMemberEmail = this.editdata.memberMail.split(",");
				this.allMemberName = this.editdata.memberName.split(",");
				this.editedstartDate = new Date(this.editdata.startdate);
				this.editedTitle = decode(this.editdata.title);
				setTimeout(()=>{     
					this.setcvFast();
				}, 1000);
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
