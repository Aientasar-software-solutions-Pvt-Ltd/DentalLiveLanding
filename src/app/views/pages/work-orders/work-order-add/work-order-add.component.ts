//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { WorkOrderGuideComponent } from '../work-order-guide/work-order-guide.component';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-work-order-add',
  templateUrl: './work-order-add.component.html',
  styleUrls: ['./work-order-add.component.css']
})
export class WorkOrderAddComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
    selectedCity = '';
	public isvalidDate = false;
	public isvalidToothGuide = false;
	public allcases: any[] = []
	public caseid = '';
	public patientid = '';
	public casesName = '';
	public patientName = '';
	milestoneid = sessionStorage.getItem("checkmilestoneid");
	checkCase = sessionStorage.getItem("checkCase");
	//checkCase = '2';
	keyword = 'name';
	public jsonObj = {
	  caseId: '',
	  patientId: '',
	  title: '',
	  notes: {},
	  startdate: 0,
	  enddate: 0,
	  toothguide: {},
	  milestoneId: '',
	  presentStatus: 0,
	  patientName: '',
	}
	minDate = new Date();
	tabledata:any;
	tabledataAll:any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private utilitydev: UtilityServicedev, private usr: AccdetailsService) { }
	
	@ViewChild(WorkOrderGuideComponent)
	orders: WorkOrderGuideComponent;
	
	back(): void {
		this.location.back()
	}
	
	ngOnInit(): void {
		this.getCaseDetails();
		this.getAllCases();
	}
	
	onSubmitWorkOrders(form: NgForm){
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
		//alert(JSON.stringify(this.orders.getToothGuide()));
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		if(data.milestoneid !='')
		{
			this.jsonObj['milestoneId'] = data.milestoneid;
		}
		this.jsonObj['title'] = data.title;
		this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['members'] = this.allMemberEmail;
		
		
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
			this.jsonObj['notes'] = this.cvfastval.returnCvfast();
		}
		
		//alert(JSON.stringify(this.jsonObj));
		const backurl = sessionStorage.getItem('backurl');
		
		this.cvfastval.processFiles(this.utility.apiData.userWorkOrders.ApiUrl, this.jsonObj, true, 'Work order added successfully', backurl, 'post', '','notes');
		
	}
	
	getAllMembers(caseId) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
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
						  name: '',
						  memberid: ''
						});
						this.getuserdetailsall(GetAllData[k].invitedUserMail,k);
					}
				}
			}, error => {
			  if (error.status === 404)
				swal.fire('E-Mail ID does not exists,please signup to continue');
			  else if (error.status === 403)
				swal.fire('Account Disabled,contact Dental-Live');
			  else if (error.status === 400)
				swal.fire('Wrong Password,please try again');
			  else if (error.status === 401)
				swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
			  else if (error.status === 428)
				swal.fire(error.error);
			  else
				swal.fire('Unable to fetch the data, please try again');
			});
			
		}
	}
	selectEvents(item: any) {
		this.allMemberEmail = Array();
		this.allMemberName = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].memberid);
			this.allMemberName.push(item[k].name);
		}
		//alert(JSON.stringify(this.allMemberEmail));
		//alert(JSON.stringify(this.allMemberName));
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
			//alert(JSON.stringify(this.allMember));
		}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
	getCaseDetails() {
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = sessionStorage.getItem("caseId");
		if(caseId != '')
		{
			var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
			swal.fire({
				html: sweet_loader,
				icon: "https://www.boasnotas.com/img/loading2.gif",
				showConfirmButton: false,
				allowOutsideClick: false,     
				closeOnClickOutside: false,
				timer: 2200,
				//icon: "success"
			});
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					this.casesName = this.tabledata.title;
					this.patientName = this.tabledata.patientName;
					this.caseid = this.tabledata.caseId;
					this.patientid = this.tabledata.patientId;
					//alert(JSON.stringify(this.tabledata));
					this.getAllMembers(this.tabledata.caseId);
				}
			}, error => {
			  if (error.status === 404)
				swal.fire('E-Mail ID does not exists,please signup to continue');
			  else if (error.status === 403)
				swal.fire('Account Disabled,contact Dental-Live');
			  else if (error.status === 400)
				swal.fire('Wrong Password,please try again');
			  else if (error.status === 401)
				swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
			  else if (error.status === 428)
				swal.fire(error.error);
			  else
				swal.fire('Unable to fetch the data, please try again');
			});
		}
	}
	
	getAllCases() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userCases.ApiUrl;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				this.tabledataAll = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.tabledataAll));
				this.allcases = Array();
				for(var k = 0; k < this.tabledataAll.length; k++)
				{
					if(this.tabledataAll[k].caseStatus == true)
					{
						let name = this.tabledataAll[k].title;
						this.allcases.push({
						  caseId: this.tabledataAll[k].caseId,
						  patientName: this.tabledataAll[k].patientName,
						  patientId: this.tabledataAll[k].patientId,
						  name: name
						});
					}
				}
				//alert(JSON.stringify(this.allcases));
			}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
	
	selectEvent(item: any) {
		//alert(JSON.stringify(item));
		this.caseid = item.caseId;
		this.patientid = item.patientId;
		this.patientName = item.patientName;
		this.casesName = item.name;
		this.getAllMembers(item.caseId);
	// do something with selected item
	}
	
	onChangeSearch(search: string) {
	// fetch remote data from here
	// And reassign the 'data' which is binded to 'data' property.
	}
	
	onFocused(e: any) {
	// do something
	}
}