//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-milestone-details',
  templateUrl: './milestone-details.component.html',
  styleUrls: ['./milestone-details.component.css']
})

export class MilestoneDetailsComponent implements OnInit {
	show = false;
	show1 = false;
	id:any = "tab1";
	tabContent(ids:any){
		this.id = ids;
		sessionStorage.setItem("tabActive", ids);
	}

	public descriptionObj = {
	  links: Array(),
	  text: ''
	}
	public jsonObj = {
	  title: '',
	  description: {},
	  startdate: 0,
	  duedate: 0,
	  presentStatus: 0,
	  reminder: 0,
	  milestoneId: '',
	  caseId: '',
	  patientId: '',
	  patientName: '',
	}
	
	masterSelected:boolean;
	tabledata:any;
	checkedList:any;
	public module = 'patient';
	taskdata:any;
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	public attachmentFiles: any[] = []
	
	dtOptions: DataTables.Settings = {};
	
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService) { this.masterSelected = false; }
  
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
		this.getallmilestone();
		this.getalltasks();
		//Set current tab
		let tabActive = sessionStorage.getItem("tabActive");
		(tabActive) ? this.id = tabActive : this.id = 'tab1';
	}
	
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	getallmilestone() {
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
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userMilestones.ApiUrl;
		let milestoneId = sessionStorage.getItem("milestoneId");
		if(milestoneId != '')
		{
			url += "?milestoneId="+milestoneId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					//this.tabledata.description = JSON.stringify(this.tabledata.description);
					this.descriptionObj.text = this.tabledata.description.text;
					this.descriptionObj.links = this.tabledata.description.links;
					this.setcvFast(this.tabledata.description);
					this.cvfastText = true;
					
					//alert(this.tabledata['0'].presentStatus);
				}
			}, (error) => {
					alert(JSON.stringify(error));
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	addGeneralTask(milestoneId: any, caseId: any) {
		sessionStorage.setItem('milestoneId', milestoneId);
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['milestones/general-task-add']);
	}
	
	getalltasks() {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userTasks.ApiUrl;
		let milestoneId = sessionStorage.getItem("milestoneId");
		if(milestoneId != '')
		{
			url += "?milestoneId="+milestoneId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.taskdata = JSON.parse(Response.toString());
					//alert(JSON.stringify(this.taskdata));
				}
			}, (error) => {
					alert(JSON.stringify(error));
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	editGeneralTask(taskId: any, caseId: any) {
		sessionStorage.setItem('taskId', taskId);
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['milestones/general-task-edit']);
	}
	
	deleteTask(taskId: any) {
		let url = this.utility.apiData.userTasks.ApiUrl;
		this.dataService.deleteDataRecord(url, taskId, 'taskId').subscribe(Response => {
			swal.fire("Task deleted successfully");
			this.getalltasks();
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
	}
	
	viewGeneralTask(taskId: any, caseId: any) {
		sessionStorage.setItem('taskId', taskId);
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['milestones/general-task-view']);
	}
	
	setcvFast(obj: any, page = 'milestone')
	{
		if(page == 'milestone')
		{
			this.attachmentFiles = Array();
			if(obj.links.length > 0)
			{
				this.cvfastLinks = true;
				for(var i = 0; i < obj.links.length; i++)
				{
					
					let ImageName = obj.links[i];
					let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+obj.links[i]+'&module='+this.module+'&type=get';
					this.dataService.getallData(url, true)
					.subscribe(Response => {
						if (Response)
						{
							this.attachmentFiles.push({ imgName: ImageName, ImageUrl: Response });
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
		}
		else
		{
			if(obj.length > 0)
			{
				for(var i = 0; i < obj.length; i++)
				{
					
					let ImageName = obj[i].files[0].name;
					let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+ImageName+'&module='+this.module+'&type=get';
					this.dataService.getallData(url, true)
					.subscribe(Response => {
						if (Response)
						{
							this.casefilesArray[i-1].files[0].url = Response;
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
				this.filesdata = this.casefilesArray;
			}
		}
	}
	
	onSubmitMilestone(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.onGetdateData(form.value);
	}
	
	onGetdateData(data: any)
	{
		this.jsonObj['milestoneId'] = data.milestoneId;
		this.jsonObj['caseId'] = data.caseId;
		this.jsonObj['patientId'] = data.patientId;
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['title'] = data.title;
		this.jsonObj['description'] = this.descriptionObj;
		
		this.jsonObj['startdate'] = Number(data.startdate);
		this.jsonObj['duedate'] = Number(data.duedate);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['reminder'] = Number(data.reminder);
		
		//alert(JSON.stringify(this.jsonObj));
		this.dataService.putData(this.utility.apiData.userMilestones.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  swal.fire('Milestone updated successfully');
		  this.router.navigate(['/milestones/milestones-list']);
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