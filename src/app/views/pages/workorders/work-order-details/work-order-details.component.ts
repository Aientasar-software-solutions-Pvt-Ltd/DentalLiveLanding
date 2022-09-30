//@ts-nocheck
import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WorkOrderGuideComponent } from '../work-order-guide/work-order-guide.component';
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
  selector: 'app-work-order-details',
  templateUrl: './work-order-details.component.html',
  styleUrls: ['./work-order-details.component.css']
})
export class WorkOrderDetailsComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	isLoadingData = true;
	show = false;
	show1 = false;
	toothData:any;
	id:any = "tab1";
	shimmer = Array;
	tabContent(ids:any){
		this.id = ids;
		setTimeout(()=>{    
			if(this.toothData)
			{
				this.orders.setToothGuide(this.toothData);
			}
		}, 1000);
	}
	showComment: any;
	replyToggle(index){
		this.setMessageRpValue = false;
		this.showComment =index;
	}
	@ViewChild(WorkOrderGuideComponent)
	orders: WorkOrderGuideComponent;
	public jsonObj = {
	  workorderId: '',
	  caseId: '',
	  patientId: '',
	  title: '',
	  enddate: 0,
	  toothguide: {},
	  presentStatus: 0,
	  members: 0
	}
	public jsonObjmsg = {
		patientId: '',
		caseId: '',
		patientName: '',
		message: {},
		comments: [{}],
		messageType: '0'
	}
	dtOptions: DataTables.Settings = {};
	public module = 'patient';
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	cvfastMsgText: boolean = false;
	cvfastMsgLinks: boolean = false;
	setMessageValue: boolean = false;
	setMessageRpValue: boolean = false;
	public attachmentFiles: any[] = []
	public casefilesArray: any[] = []
	public messageArray: any[] = []
	public messageDataArray: any[] = []
	public messageAry: any[] = []
	messagedata:any;
	referalmembers:any;
	public referalmembersName = '';
	
	public Img = 'assets/images/users.png';
	public caseImage = false;
	patientImg: any;
	parmCaseId:any;
	casesName:any;
	userDetails:any;
	patientName:any;
	
	public isvalidDate = false;
	minDate = new Date();
	public descriptionObj = {
	  links: Array(),
	  text: ''
	}
	
	workorderId: any;
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private utilitydev: UtilityServicedev, private route: ActivatedRoute) { 
		this.workorderId = this.route.snapshot.paramMap.get('workorderId');
	}
  
	back(): void {
		this.location.back()
	}
	tabledata:any;
	ngOnInit(): void {
		this.userDetails = this.usr.getUserDetails(false);
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
		this.getallworkorder();
		setTimeout(()=>{    
			if(this.toothData)
			{
				this.orders.setToothGuide(this.toothData);
			}
		}, 1000);
	}
	
	getallworkorder() {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userWorkOrders.ApiUrl;
		let workorderId = this.workorderId;
		if(workorderId != '')
		{
			url += "?workorderId="+workorderId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.isLoadingData = false;
					this.tabledata = JSON.parse(Response.toString());
					this.toothData = this.tabledata.toothguide;
					this.setcvFast(this.tabledata.notes);
					this.cvfastText = true;
					this.descriptionObj.text = this.tabledata.notes.text;
					this.descriptionObj.links = this.tabledata.notes.links;
					this.getMessage(this.tabledata.caseId);
					this.referalmembers = this.tabledata.members;
					this.parmCaseId = this.tabledata.caseId;
					this.getuserdetailsall(this.referalmembers);
					this.getCaseDetails();
					
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
	
	getuserdetailsall(userId) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			for(var i=0; i < userId.length; i++)
			{
				let url = this.utility.apiData.userColleague.ApiUrl;
				if(userId != '')
				{
					url += "?dentalId="+userId[i];
				}
				this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let userData = JSON.parse(Response.toString());
					let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
					if(this.referalmembersName)
					{
						this.referalmembersName += " , "+name;
					}
					else
					{
						this.referalmembersName += name;
					}
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
	setcvFast(obj: any, page = 'task')
	{
		if(page == 'task')
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
					});
				}
				this.tabledata = this.casefilesArray;
			}
		}
	}
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	ngAfterViewInit() {
		setTimeout(()=>{    
			if(this.toothData)
			{
				this.orders.setToothGuide(this.toothData);
			}
		}, 1000);
	}
	
	
	onSubmitWorkOrders(form: NgForm) {
		if(form.value.startdate >= Date.parse(form.value.enddate))
		{
			this.isvalidDate =true;
			
			swal('Due date should be greater than to start date');
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
		this.jsonObj['workorderId'] = data.workorderId;
		this.jsonObj['caseId'] = data.caseId;
		this.jsonObj['patientId'] = data.patientId;
		this.jsonObj['title'] = data.title;
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['members'] = this.referalmembers;
		this.jsonObj['patientName'] = data.patientName;
		
		
		this.dataService.putData(this.utility.apiData.userWorkOrders.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  this.getallworkorder();
		  swal('WorkOrder Due date updated successfully');
		}, error => {
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
		});
	}
	getMessage(caseId: any) {
		let user = this.usr.getUserDetails(false);
		
		if(user)
		{
			let url = this.utility.apiData.userMessage.ApiUrl;
			let messageType = "2";
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			url += "&messageType="+Number(messageType);
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.messagedata = JSON.parse(Response.toString()).reverse();
					
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
								patientName: this.messagedata[i].resourceOwner,
								messagetext: this.removeHTML(this.messagedata[i].message.text),
								messageimg: this.messagedata[i].message.links,
								messagedate: this.messagedata[i].dateCreated,
								messagecomment: this.messagedata[i].comments,
								messageReferenceId: this.messagedata[i].messageReferenceId,
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
								patientName: this.messagedata[i].resourceOwner,
								messagetext: '',
								messageimg: [],
								messagedate: this.messagedata[i].dateCreated,
								messageReferenceId: this.messagedata[i].messageReferenceId,
								messagecomment: this.messagedata[i].comments
							});
						}
					}
					setTimeout(()=>{   
						this.messageAry = this.messageDataArray;
						this.messageAry.sort((a, b) => (a.messagedate > b.messagedate) ? -1 : 1)
					}, 2000);
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
	setcvFastComment(obj: any, index: any)
	{
		let Comments = Array();
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
								if (error.status)
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
							Comments.push({ text: this.removeHTML(CommentsText), isShow: 1, isShowLink: 1, links: NewCommentArray });
						}
						else
						{
							Comments.push({ text: this.removeHTML(CommentsText), isShow: 1, isShowLink: 0, links: NewCommentArray });
						}
					}
					else
					{
						if(NewCommentArray.length > 0)
						{
							Comments.push({ text: this.removeHTML(CommentsText), isShow: 0, isShowLink: 1, links: NewCommentArray });
						}
						else
						{
							Comments.push({ text: this.removeHTML(CommentsText), isShow: 0, isShowLink: 0, links: NewCommentArray });
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
		swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		});
		this.jsonObjmsg['caseId'] = form.value.CcaseId;
		this.jsonObjmsg['patientId'] = form.value.CpatientId;
		this.jsonObjmsg['patientName'] = form.value.CpatientName;
		this.jsonObjmsg['messageId'] = form.value.CmessageId;
		this.jsonObjmsg['comment'] = this.messageAry[form.value.Ccomments].messagecomment;
		this.jsonObjmsg['messageType'] = '2';
		this.jsonObjmsg['messageReferenceId'] = form.value.CmessageReferenceId;
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Comments added successfully', 'workorders/work-orders', 'put', '','comments', '1','Comments already exists.').then(
		(value) => {
		swal.close();
		this.sending = false;
		},
		(error) => {
		swal.close();
		this.sending = false;
		});
	};
	onSubmitMessage(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		});
		this.jsonObjmsg['caseId'] = form.value.caseId;
		this.jsonObjmsg['patientId'] = form.value.patientId;
		this.jsonObjmsg['patientName'] = form.value.patientName;
		this.jsonObjmsg['message'] = this.cvfastval.returnCvfast();
		this.jsonObjmsg['messageType'] = '2';
		this.jsonObjmsg['messageReferenceId'] = form.value.messageReferenceId;
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Message added successfully', 'workorders/work-orders', 'post', '','message','1','Message already exists.').then(
		(value) => {
		swal.close();
		this.sending = false;
		},
		(error) => {
		swal.close();
		this.sending = false;
		});
	};
	
	getCaseDetails() {
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = this.parmCaseId;
		if(caseId != 0)
		{
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					let CaseDetails = JSON.parse(Response.toString());
					this.casesName = CaseDetails.title;
					this.patientName = CaseDetails.patientName;
				}
			}, error => {
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
			});
		}
	}
	
	@ViewChild('videoPlayer') videoplayer: ElementRef;

	video() {
		this.videoplayer?.nativeElement.play();
	}
	removeHTML(str){ 
		var tmp = document.createElement("DIV");
		tmp.innerHTML = str;
		return tmp.textContent || tmp.innerText || "";
	}
}