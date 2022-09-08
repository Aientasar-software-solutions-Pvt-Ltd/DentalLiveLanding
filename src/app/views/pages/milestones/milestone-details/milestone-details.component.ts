//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';	
import { Location } from '@angular/common';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-milestone-details',
  templateUrl: './milestone-details.component.html',
  styleUrls: ['./milestone-details.component.css']
})

export class MilestoneDetailsComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	isLoadingData = true;
	show = false;
	show1 = false;
	id:any = "tab1";
	shimmer = Array;
	tabContent(ids:any){
		this.id = ids;
		localStorage.setItem("tabActive", ids);
	}
	
	showComment: any;
	replyToggle(index){
		this.setMessageRpValue = false;
		this.showComment =index;
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
	
	public jsonObjmsg = {
		patientId: '',
		caseId: '',
		patientName: '',
		message: {},
		comments: [{}],
		messageType: '0'
	}
	masterSelected:boolean;
	tabledata:any;
	checkedList:any;
	messagedata:any;
	public module = 'patient';
	public indexRow = 0;
	taskdata = Array();
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	cvfastMsgText: boolean = false;
	cvfastMsgLinks: boolean = false;
	setMessageValue: boolean = false;
	setMessageRpValue: boolean = false;
	public attachmentFiles: any[] = []
	public messageArray: any[] = []
	public messageDataArray: any[] = []
	public messageAry: any[] = []
	
	dtOptions: DataTables.Settings = {};
	
	getmilestoneId: any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private route: ActivatedRoute) { 
		this.masterSelected = false; 
		this.getmilestoneId = this.route.snapshot.paramMap.get('milestoneId');
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
		this.getallmilestone();
		this.getalltasks();
		//Set current tab
		let tabActive = localStorage.getItem("tabActive");
		(tabActive) ? this.id = tabActive : this.id = 'tab1';
	}
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	addWorkOrders(milestoneId: any, caseId: any) {
		localStorage.setItem('checkCase', '1');
		localStorage.setItem('checkmilestoneid', milestoneId);
		localStorage.setItem('caseId', caseId);
		this.router.navigate(['workorders/work-order-add/'+caseId]);
	}
	addReferal(milestoneId: any, caseId: any) {
		localStorage.setItem('checkCase', '1');
		localStorage.setItem('checkmilestoneidref', milestoneId);
		localStorage.setItem('caseId', caseId);
		this.router.navigate(['referrals/referral-add/'+caseId]);
	}
	getallmilestone() {
		this.tabledata = '';
		/* swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		}); */
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userMilestones.ApiUrl;
		let milestoneId = this.getmilestoneId;
		if(milestoneId != '')
		{
			url += "?milestoneId="+milestoneId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					this.isLoadingData = false;
					this.tabledata = JSON.parse(Response.toString());
					//this.tabledata.description = JSON.stringify(this.tabledata.description);
					this.descriptionObj.text = this.tabledata.description.text;
					this.descriptionObj.links = this.tabledata.description.links;
					this.setcvFast(this.tabledata.description);
					this.cvfastText = true;
					this.getMessage(this.tabledata.caseId);
					//alert(this.tabledata['0'].presentStatus);
				}
			}, (error) => {
					alert(JSON.stringify(error));
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
		}
	}
	
	addGeneralTask(milestoneId: any, caseId: any) {
		localStorage.setItem('milestoneId', milestoneId);
		localStorage.setItem('caseId', caseId);
		this.router.navigate(['milestones/general-task-add']);
	}
	
	getalltasks() {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userTasks.ApiUrl;
		let milestoneId = this.getmilestoneId;
		//alert(JSON.stringify(user));
		//alert(milestoneId);
		if(milestoneId != '')
		{
			url += "?milestoneId="+milestoneId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let getTask = JSON.parse(Response.toString());
					//alert(JSON.stringify(getTask));
					//this.taskdata = Array();
					
					for(var k = 0; k < getTask.length; k++)
					{
						this.taskdata.push({
						  id: this.indexRow,
						  title: getTask[k].title,
						  description: getTask[k].description.text,
						  startdate: getTask[k].startdate,
						  duedate: getTask[k].duedate,
						  presentStatus: getTask[k].presentStatus,
						  memberName: getTask[k].memberName,
						  taskId: getTask[k].taskId,
						  workorderId: '',
						  referralId: '',
						  caseId: getTask[k].caseId,
						  dateCreated: getTask[k].dateCreated,
						  patientName: getTask[k].patientName,
						  patientId: getTask[k].patientId,
						  milestoneId: getTask[k].milestoneId,
						  reminder: getTask[k].reminder,
						  taskType: 'General',
						});
						this.indexRow++;
					}
					//this.taskdata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				}
				this.getallworkorders();
			}, (error) => {
					//alert(JSON.stringify(error));
				this.getallworkorders();
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
		}
	}
	getallworkorders() {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userWorkOrders.ApiUrl;
		let milestoneId = this.getmilestoneId;
		//alert(milestoneId);
		if(milestoneId != '')
		{
			url += "?milestoneId="+milestoneId;
		}
		//alert(JSON.stringify(milestoneId));
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let getWorkOrders = JSON.parse(Response.toString());
					//alert(JSON.stringify(getWorkOrders));
					//this.taskdata = Array();
					for(var k = 0; k < getWorkOrders.length; k++)
					{
						this.taskdata.push({
						  id: this.indexRow,
						  title: getWorkOrders[k].title,
						  description: getWorkOrders[k].notes.text,
						  startdate: getWorkOrders[k].startdate,
						  duedate: getWorkOrders[k].enddate,
						  presentStatus: getWorkOrders[k].presentStatus,
						  memberName: '',
						  taskId: '',
						  workorderId: getWorkOrders[k].workorderId,
						  referralId: '',
						  caseId: getWorkOrders[k].caseId,
						  dateCreated: getWorkOrders[k].dateCreated,
						  patientName: getWorkOrders[k].patientName,
						  patientId: getWorkOrders[k].patientId,
						  milestoneId: getWorkOrders[k].milestoneId,
						  taskType: 'WorkOrder',
						});
						//alert(this.indexRow);
						//alert(getWorkOrders[k].members);
						this.getuserdetailsall(getWorkOrders[k].members,this.indexRow);
						this.indexRow++;
					} 
					//this.taskdata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					//alert(JSON.stringify(getWorkOrders));
				}
				this.getallreferrals();
			}, (error) => {
				this.getallreferrals();
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
		}
	}
	
	getallreferrals() {
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userReferrals.ApiUrl;
		let milestoneId = this.getmilestoneId;
		
		if(milestoneId != '')
		{
			url += "?milestoneId="+milestoneId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let getReferrals = JSON.parse(Response.toString());
					//alert(JSON.stringify(getReferrals));
					//this.taskdata = Array();
					for(var k = 0; k < getReferrals.length; k++)
					{
						this.taskdata.push({
						  id: this.indexRow,
						  title: getReferrals[k].title,
						  description: getReferrals[k].notes.text,
						  startdate: getReferrals[k].startdate,
						  duedate: getReferrals[k].enddate,
						  presentStatus: getReferrals[k].presentStatus,
						  memberName: '',
						  taskId: '',
						  workorderId: '',
						  referralId: getReferrals[k].referralId,
						  caseId: getReferrals[k].caseId,
						  dateCreated: getReferrals[k].dateCreated,
						  patientName: getReferrals[k].patientName,
						  patientId: getReferrals[k].patientId,
						  milestoneId: getReferrals[k].milestoneId,
						  taskType: 'Referral',
						});
						//alert(JSON.stringify(getReferrals[k].members));
						this.getuserdetailsall(getReferrals[k].members,this.indexRow);
						this.indexRow++;
					}
					//alert(JSON.stringify(getReferrals));
					//this.taskdata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					
				}
			}, (error) => {
					alert(JSON.stringify(error));
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
		}
	}
	
	editGeneralTask(taskId: any, caseId: any, taskType: any) {
		localStorage.setItem('taskId', taskId);
		localStorage.setItem('caseId', caseId);
		if(taskType == 'General'){
			this.router.navigate(['milestones/general-task-edit/'+taskId]);
		}
		else if(taskType == 'WorkOrder'){
			this.router.navigate(['work-orders/work-order-edit/'+taskId]);
		}
		else{
			this.router.navigate(['referral/referral-edit/'+taskId]);
		}
		
	}
	
	deleteTask(taskId: any) {
		let milestoneId = this.getmilestoneId;
		//alert(milestoneId);
		let url = this.utility.apiData.userTasks.ApiUrl;
		this.dataService.deleteDataRecord(url, taskId, 'taskId').subscribe(Response => {
			swal('Task deleted successfully');
			this.getalltasks();
			
		}, (error) => {
		  swal( 'Unable to fetch data, please try again');
		  return false;
		});
	}
	
	viewGeneralTask(taskId: any, caseId: any, taskType: any) {
		localStorage.setItem('taskId', taskId);
		localStorage.setItem('caseId', caseId);
		
		if(taskType == 'General'){
			this.router.navigate(['milestones/general-task-view/'+taskId]);
		}
		else if(taskType == 'WorkOrder'){
			this.router.navigate(['work-orders/work-order-details/'+taskId]);
		}
		else{
			this.router.navigate(['referral/referral-details/'+taskId]);
		}
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
		  
		  swal('Milestone updated successfully');
		  this.router.navigate(['/milestones/milestones-list']);
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
	
	getMessage(caseId: any) {
		let user = this.usr.getUserDetails(false);
		
		if(user)
		{
			let url = this.utility.apiData.userMessage.ApiUrl;
			let messageType = "3";
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			url += "&messageType="+Number(messageType);
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.messagedata = JSON.parse(Response.toString()).reverse();
					
					//alert(JSON.stringify(this.messagedata));
					
					this.messageDataArray = Array();
					for(var i = 0; i < this.messagedata.length; i++)
					{
						let strVal = JSON.stringify(this.messagedata[i].message);
						if(strVal.length > 2)
						{
							this.messageDataArray.push({
								patientId: this.messagedata[i].patientId,
								messageId: this.messagedata[i].messageId,
								caseId: this.messagedata[i].caseId,
								patientName: this.messagedata[i].patientName,
								messagetext: this.messagedata[i].message.text,
								messageimg: this.messagedata[i].message.links,
								messagedate: this.messagedata[i].dateCreated,
								messagecomment: this.messagedata[i].comments,
								messagecomments: this.messagedata[i].comments
							});
							this.setcvFastComment(this.messagedata[i].comments,i);
							this.setcvFastMsg(this.messagedata[i].message,i);
							this.cvfastMsgText = true;
						}
						else
						{
							this.messageDataArray.push({
								patientId: this.messagedata[i].patientId,
								messageId: this.messagedata[i].messageId,
								caseId: this.messagedata[i].caseId,
								patientName: this.messagedata[i].patientName,
								messagetext: '',
								messageimg: [],
								messagedate: this.messagedata[i].dateCreated,
								messagecomment: this.messagedata[i].comments
							});
						}
					}
					setTimeout(()=>{   
						this.messageAry = this.messageDataArray;
						this.messageAry.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)
					}, 2000);
				}
			}, (error) => {
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
			
		}
	}
	setcvFastComment(obj: any, index: any)
	{
		let Comments = Array();
		//alert(obj.links.length);
		if(obj.length > 0)
		{
			for(var i = 0; i < obj.length; i++)
			{
				if(JSON.stringify(obj[i]).length > 2)
				{
					let CommentObj = obj[i];
					let CommentsText = CommentObj.text;
					let CommentsLinks = CommentObj.links;
					let NewCommentArray = Array();
					if(CommentsLinks.length > 0)
					{
						for(var j = 0; j < CommentsLinks.length; j++)
						{
							let ImageName = CommentsLinks[j];
							let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+CommentsLinks[j]+'&module='+this.module+'&type=get';
							this.dataService.getallData(url, true)
							.subscribe(Response => {
								if (Response)
								{
									NewCommentArray.push({ imgName: ImageName, ImageUrl: Response });
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
					if(CommentObj.text)
					{
						if(NewCommentArray.length > 0)
						{
							Comments.push({ text: CommentsText, isShow: 1, isShowLink: 1, links: NewCommentArray });
						}
						else
						{
							Comments.push({ text: CommentsText, isShow: 1, isShowLink: 0, links: NewCommentArray });
						}
					}
					else
					{
						if(NewCommentArray.length > 0)
						{
							Comments.push({ text: CommentsText, isShow: 0, isShowLink: 1, links: NewCommentArray });
						}
						else
						{
							Comments.push({ text: CommentsText, isShow: 0, isShowLink: 0, links: NewCommentArray });
						}
					}
				}
				
			}
			this.messageDataArray[index].messagecomments = Comments;
		}
		
	}
	
	setcvFastMsg(obj: any, index: any)
	{
		let MessageDetails = Array();
		if(obj.links.length > 0)
		{
			this.cvfastMsgLinks = true;
			for(var i = 0; i < obj.links.length; i++)
			{
				let ImageName = obj.links[i];
				let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+obj.links[i]+'&module='+this.module+'&type=get';
				this.dataService.getallData(url, true)
				.subscribe(Response => {
					if (Response)
					{
						MessageDetails.push({ imgName: ImageName, ImageUrl: Response });
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
			setTimeout(() => 
			{
				this.messageDataArray[index].messageimg = MessageDetails;  
			},
			500);
		}
	}
	
	onSubmitComment(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.jsonObjmsg['caseId'] = form.value.CcaseId;
		this.jsonObjmsg['patientId'] = form.value.CpatientId;
		this.jsonObjmsg['patientName'] = form.value.CpatientName;
		this.jsonObjmsg['messageId'] = form.value.CmessageId;
		this.jsonObjmsg['comment'] = this.messageAry[form.value.Ccomments].messagecomment;
		this.jsonObjmsg['messageType'] = '3';
		this.jsonObjmsg['messageReferenceId'] = form.value.CmessageReferenceId;
		//alert(JSON.stringify(this.jsonObjmsg));
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Comments added successfully', 'milestones/milestone-list', 'put', '','comments');
		//this.getMessage(this.tabledata.caseId);
	};
	onSubmitMessage(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.jsonObjmsg['caseId'] = form.value.caseId;
		this.jsonObjmsg['patientId'] = form.value.patientId;
		this.jsonObjmsg['patientName'] = form.value.patientName;
		this.jsonObjmsg['message'] = this.cvfastval.returnCvfast();
		this.jsonObjmsg['messageType'] = '3';
		this.jsonObjmsg['messageReferenceId'] = form.value.messageReferenceId;
		//alert(JSON.stringify(this.jsonObjmsg));
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Message added successfully', 'milestones/milestone-list', 'post', '','message');
		//this.getMessage(this.tabledata.caseId);
	};
	
	getuserdetailsall(userId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let memberResult = '';
			for(var j = 0; j < userId.length; j++)
			{
				let url = this.utility.apiData.userColleague.ApiUrl;
				if(userId != '')
				{
					url += "?dentalId="+userId[j];
				}
				this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let userData = JSON.parse(Response.toString());
					//alert(JSON.stringify(userData));
					let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
					if(memberResult)
					{
						memberResult += ','+name;
					}
					else{
						memberResult += name;
					}
					//alert(JSON.stringify(memberResult));
					if(j == userId.length)
					{
						this.taskdata[index].memberName = memberResult;
					}
				}
				}, (error) => {
				  swal( 'Unable to fetch data, please try again');
				  return false;
				});
			}
		}
	}
}