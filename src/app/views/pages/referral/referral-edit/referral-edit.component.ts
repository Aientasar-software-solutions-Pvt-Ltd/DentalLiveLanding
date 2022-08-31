//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReferralGuideComponent } from '../referral-guide/referral-guide.component';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-referral-edit',
  templateUrl: './referral-edit.component.html',
  styleUrls: ['./referral-edit.component.css']
})
export class ReferralEditComponent implements OnInit {
	@ViewChild(Cvfast) cv!: Cvfast;
	
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
    selectedCity = '';
	
	public jsonObj = {
	  referralId: '',
	  caseId: '',
	  patientId: '',
	  title: '',
	  notes: {},
	  toothguide: {},
	  duedate: 0,
	  startdate: 0,
	  enddate: 0,
	  presentStatus: 0
	}
	public casesName = '';
	public patientName = '';
	tabledata:any;
	editedDate:any;
	minDate = new Date();
	public isvalidDate = false;
	
	public isvalidToothGuide = false;
    referralId:any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService, private route: ActivatedRoute)  {
	this.referralId = this.route.snapshot.paramMap.get('referralId');
	}
  
	@ViewChild(ReferralGuideComponent)
	orders: ReferralGuideComponent;
	public patientImg: any;
	
	back(): void {
		this.location.back()
	}
	ngOnInit(): void {
		this.getEditReferral();
	}
	onSubmitReferral(form: NgForm){
		let toothGuilde = JSON.stringify(this.orders.getToothGuide());
		if(Date.parse(form.value.startdate) >= Date.parse(form.value.enddate))
		{
			this.isvalidDate =true;
		}
		else
		{
			this.isvalidDate =false;
		}
		if(toothGuilde.length == 2)
		{
			this.isvalidToothGuide =true;
		}
		else
		{
			this.isvalidToothGuide =false;
		}
		if ((form.invalid) || (this.isvalidDate == true) || (this.isvalidToothGuide == true)) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.onGetalldata(form.value);
	}
	
	onGetalldata(data: any)
	{
		this.jsonObj['referralId'] = data.referralId;
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		if(data.milestoneId)
		{
		this.jsonObj['milestoneId'] = data.milestoneId;
		}
		this.jsonObj['title'] = data.title;
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['members'] = this.allMemberEmail;
		
		if((this.cv.returnCvfast().text != '') || (this.cv.returnCvfast().links.length > 0))
		{
			this.jsonObj['notes'] = this.cv.returnCvfast();
		}
		
		//alert(JSON.stringify(this.jsonObj));
		const backurl = sessionStorage.getItem('backurl');
		
		this.cv.processFiles(this.utility.apiData.userReferrals.ApiUrl, this.jsonObj, true, 'Referral Updated successfully', backurl, 'put', '','notes');
		
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
			this.allMember[index].memberid = userData.dentalId;
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
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			//let caseId = sessionStorage.getItem("caseId");
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
						  name: '',
						  memberid: ''
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
	selectEvents(item: any) {
		this.allMemberName = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].memberid);
			this.allMemberName.push(item[k].name);
		}
		//alert(JSON.stringify(this.allMemberEmail));
		//alert(JSON.stringify(this.allMemberName));
	}
	getEditReferral() {
		swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		});
		let url = this.utility.apiData.userReferrals.ApiUrl;
		let referralId = this.referralId;
		if(referralId != '')
		{
			url += "?referralId="+referralId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				swal.close();
				this.editedDate = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.editedDate));
				this.toothData = this.editedDate.toothguide;
				this.allMemberEmail = this.editedDate.members;
				setTimeout(()=>{     
					this.setcvFast();
				}, 1000);
				this.getCaseDetails(this.editedDate.caseId);
				this.getAllMembers(this.editedDate.caseId);
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
		this.cv.setCvfast(this.editedDate.notes);
	}
	ngAfterViewInit() {
		this.orders.setToothGuide(this.toothData)
	}
	getCaseDetails(caseId) {
		let url = this.utility.apiData.userCases.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					this.casesName = this.tabledata.title;
					this.patientName = this.tabledata.patientName;
					//alert(JSON.stringify(this.tabledata));
					//alert(JSON.stringify(this.tabledata.caseId));
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
}
