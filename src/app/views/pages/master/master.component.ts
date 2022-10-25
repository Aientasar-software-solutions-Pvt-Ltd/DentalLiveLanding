//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';	
import { NgForm } from '@angular/forms';								
import { CalendarOptions } from '@fullcalendar/angular'; 
import swal from 'sweetalert';
import { ApiDataService } from '../users/api-data.service';
import { UtilityService } from '../users/utility.service';
import { UtilityServicedev } from '../../../utilitydev.service';
import { AccdetailsService } from '../accdetails.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { Cvfast } from '../../../cvfast/cvfast.component';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	calendarOptions: CalendarOptions = {}
	sending: boolean;
	GetAllDataReferral:any;
	GetAllDataWork:any;
	public inviteEmailArray: any[] = []
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
	public allMemberDentalId: any[] = []
    selectedCity = '';
    iscount = 0;
	isLoadingData = true;
	shimmer = Array;
	show = false;
	show1 = false;
	show2 = false;
	show3 = false;
	show4 = false;
	show5 = false;
	show6 = false;
	show7 = false;
	show8 = false;
	caseEdit = false;
	showComment = -1;
	replyToggle(index){
		this.setMessageRpValue = false;
		this.showComment = index;
	}
 
	id:any = "listView";
	tabContent(ids:any){
		this.id = ids;
	}
	tab:any = "tab1";
	
	saveCompletedArchive: boolean = false;
	setMessageValue: boolean = false;
	setMessageRpValue: boolean = false;
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	cvfastMsgText: boolean = false;
	cvfastMsgLinks: boolean = false;
	public isvalidDate = false;
	fromDate: Date = new Date();

	onCompletedArchiveChanged(value:boolean){
		this.saveCompletedArchive = value;
	}
	dtOptions: DataTables.Settings = {};
	public tabledata:any;
	public milestonedata:any;
	public workordersdata:any;
	public messagedata:any;
	public patientdata:any;
	public referraldata:any;
	public patientImg: any;
	public Img = 'assets/images/users.png';
	public caseImage = false;
	public module = 'patient';
	public CaseTypeVal = '';
	public caseDate = '';
	public caseDescription = '';
	public messageArray: any[] = []
	public messageDataArray: any[] = []
	public messageAry: any[] = []
	public casefilesArray: any[] = []
	public eventsData: any[] = []
	public attachmentFiles: any[] = []
	public attachmentUploadFiles: any[] = []
	public UploadFiles: any[] = []
	public filesdata: any;
	public filesdataArray: any;
	public uploaddata: any;
	public invitedata: any;
	public threaddata: any;
	casetype = [ 
		{name :"General Dentistry", id: 1},
		{name :"Endodontics", id: 2},
		{name :"Dental Pediatrics", id: 3},
		{name :"Prosthodontics", id: 4},
		{name :"Oral Surgery", id: 5},
		{name :"Lab", id: 6},
		{name :"Periodontics", id: 7},
		{name :"Oral Pathology", id: 8},
		{name :"Dentures", id: 9},
		{name :"Orthodontics", id: 10},
		{name :"Oral Radiology", id: 11},
		{name :"Hygiene", id: 12}
	  ];
	
	public jsonObj = {
	  ownerName: '',
	  caseId: '',
	  patientId: '',
	  patientName: '',
	  dateCreated: 0,
	  files: Array()
	}
	public jsonObjmsg = {
		patientId: '',
		caseId: '',
		patientName: '',
		message: {},
		comments: [{}],
		messageType: '0'
	}
	
	public jsonObjInvite = {
		patientId: '',
		caseId: '',
		patientName: '',
		invitationText: {},
		invitedUserMail: '',
		invitedUserId: '',
		presentStatus: 0
	}
	public jsonObjInviteNew = {
		caseId: '',
		name: '',
		email: '',
	}
	
	public jsonObjInviteEdit = {
		patientId: '',
		caseId: '',
		patientName: '',
		invitedUserMail: '',
		invitedUserId: '',
		invitationId: "",
		presentStatus: 3
		//responseText: {}
	}
	public PatientImg: any;
	
	paramPatientId: any;
	userDeatils: any;
	//Set parameter from URL
	paramCaseId: string;
	paramTabName: string;
	constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private route: ActivatedRoute, private UtilityDev: UtilityServicedev) { 
		this.paramCaseId = this.route.snapshot.paramMap.get('caseId');
		this.paramTabName = this.route.snapshot.paramMap.get('tabName');
	}
	tabClick(tabs:any){
		this.tab = tabs;
		sessionStorage.setItem("masterTab", tabs);
		if(tabs == 'tab1')
		{
			this.getCaseDetails();
			this.CaseTypeVal = '';
		}
		if(tabs == 'tab2')
		{
			this.getThread();
		}
		if(tabs == 'tab3')
		{
			this.getInviteListing();
		}
		if(tabs == 'tab4')
		{
			this.getallworkorder();
		}
		if(tabs == 'tab5')
		{
			this.getReferralListing();
		}
		if(tabs == 'tab6')
		{
			this.getallmilestone();
		}
		if(tabs == 'tab7')
		{
			this.getFilesListing();
		}
	}
  ngOnInit(): void {
	this.userDeatils = this.usr.getUserDetails(false);
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
	this.cvfastText = false;
	this.cvfastLinks = false;
	this.getCaseDetails();
	this.CaseTypeVal = '';
	if(this.paramTabName == 'threads'){
		this.getThread();
	}
	(this.paramTabName == 'casefiles') ? this.getFilesListing() : '';
	(this.paramTabName == 'milestones') ? this.getallmilestone() : '';
	(this.paramTabName == 'workorders') ? this.getallworkorder() : '';
	(this.paramTabName == 'referrals') ? this.getReferralListing() : '';
	if(this.paramTabName == 'colleagues'){
		this.getInviteListing();
	}
	
	let tabName = (this.paramTabName == 'caseDetails') ? 'tab1' : (this.paramTabName == 'threads') ? 'tab2' : (this.paramTabName == 'colleagues') ? 'tab3' : (this.paramTabName == 'workorders') ? 'tab4' : (this.paramTabName == 'referrals') ? 'tab5' : (this.paramTabName == 'milestones') ? 'tab6' : (this.paramTabName == 'casefiles') ? 'tab7' : 'tab1';
	sessionStorage.setItem("masterTab", tabName);
	//Set current tab
	let masterTab = sessionStorage.getItem("masterTab");
	(masterTab) ? this.tab = masterTab : this.tab = 'tab1';
	this.sending = false;
	}

	onSubmitMessages(form: NgForm){
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userMessage.ApiUrl;
			let caseId = this.paramCaseId;
			let patientId = this.paramPatientId;
			
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			if(patientId != '')
			{
				url += "?patientId="+patientId;
			}
			let patientName = form.value.patientName;
			if(patientName != '')
			{
				if(caseId != '')
				{ 
					url += "&patientName="+patientName;
				}
				else
				{
					url += "?patientName="+patientName;
				}
			}
			let caseName = form.value.caseName;
			if(caseName != '')
			{
				if(patientName != '' || caseId != '')
				{ 
					url += "&caseName="+caseName;
				}
				else
				{
					url += "?caseName="+caseName;
				}
			}
			if(form.value.dateFrom != '')
			{
				if(patientName != '' || form.value.caseName != '' || caseId != '')
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
				if(patientName != '' || form.value.dateFrom != '' || form.value.caseName != '' || caseId != '')
				{
					url += "&dateTo="+Date.parse(form.value.dateTo);
				}
				else
				{
					url += "?dateTo="+Date.parse(form.value.dateTo);
				}
			}
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
						if(this.messagedata.length == (i+1))
						{
							this.messageAry = this.messageDataArray;
							this.messageAry.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)
						}
					}
				}
			}, (error) => {
				if (error.status === 404)
				swal('No message found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Message already exist!');
				else if (error.status === 405)
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
		}
	}
	
	onSubmitFilesFilter(form: NgForm){
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseFiles.ApiUrl;
			let caseId = this.paramCaseId;
			let patientId = this.paramPatientId;
			
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			if(form.value.dateFrom != '')
			{
				if(caseId != '')
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
				if(form.value.dateFrom != '' || caseId != '')
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
					this.isLoadingData = false;
					this.filesdataArray = JSON.parse(Response.toString()).reverse();
					if(this.filesdataArray.length == 0)
					{
						this.setcvFast('','file');
					}
					this.casefilesArray = Array();
					let casefilesDate = Array();
					if(this.filesdataArray.length > 0)
					{
						for(var i = 0; i < this.filesdataArray.length; i++)
						{
							casefilesDate.push({
							  checkdate: new Date(this.filesdataArray[i].dateCreated).toLocaleDateString("en-US")
							});
							let createddate = new Date(this.filesdataArray[i].dateCreated).toLocaleDateString("en-US");
							var isPresent = this.casefilesArray.some(function(el){
							return el.checkdate === createddate
							});
							if(isPresent == false)
							{
								this.casefilesArray.push({
								  checkdate: createddate,
								  dateCreated: this.filesdataArray[i].dateCreated,
								  patientId: this.filesdataArray[i].patientId,
								  files: this.filesdataArray[i].files,
								  caseId: this.filesdataArray[i].caseId,
								  fileUploadId: this.filesdataArray[i].fileUploadId,
								  ownerName: this.filesdataArray[i].resourceOwner,
								  filecount: 1,
								});
							}
						}
						for(var k = 0; k < this.casefilesArray.length; k++)
						{
							let count = this.getFilesCount(casefilesDate,this.casefilesArray[k].checkdate);
							this.casefilesArray[k].filecount = count;
						}
						this.setcvFast(this.casefilesArray,'file');
					}
				}
			}, error => {
				if (error.status === 404)
				swal('No patient found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered for first name or last name');
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
	setcvFastComment(obj: any, index: any)
	{
		obj.links = '';
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
								if (error.status === 404)
								swal('No patient found');
								else if (error.status === 403)
								swal('You are unauthorized to access the data');
								else if (error.status === 400)
								swal('Invalid data provided, please try again');
								else if (error.status === 401)
								swal('You are unauthorized to access the page');
								else if (error.status === 409)
								swal('Duplicate data entered for first name or last name');
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
					if(CommentObj.links && (CommentObj.text == ''))
					{
						Comments.push({ text: this.removeHTML(CommentsText), isShow: 0, isShowLink: 1, links: NewCommentArray });
					}
				}
				
			}
			this.messageDataArray[index].messagecomments = Comments;
		}
		
	}
	setcvFastMsg(obj: any, index: any, type = 'other')
	{
		let MessageDetails = Array();
		if(JSON.stringify(obj).length > 2)
		{
			if(type == 'other')
			{
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
							swal('No patient found');
							else if (error.status === 403)
							swal('You are unauthorized to access the data');
							else if (error.status === 400)
							swal('Invalid data provided, please try again');
							else if (error.status === 401)
							swal('You are unauthorized to access the page');
							else if (error.status === 409)
							swal('Duplicate data entered for first name or last name');
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
					this.messageDataArray[index].messageimg = MessageDetails;  
				}
			}
			else
			{
				for(var i = 0; i < obj.length; i++)
				{
					let ImageName = obj[i].name;
					let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+obj[i].name+'&module='+this.module+'&type=get';
					this.dataService.getallData(url, true)
					.subscribe(Response => {
						if (Response)
						{
							MessageDetails.push({ imgName: ImageName, ImageUrl: Response });
						}
					}, error => {
						if (error.status === 404)
						swal('No patient found');
						else if (error.status === 403)
						swal('You are unauthorized to access the data');
						else if (error.status === 400)
						swal('Invalid data provided, please try again');
						else if (error.status === 401)
						swal('You are unauthorized to access the page');
						else if (error.status === 409)
						swal('Duplicate data entered for first name or last name');
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
				this.messageDataArray[index].messageimg = MessageDetails; 
			}
		}
	}
  
	getallworkorder() {
		this.iscount = 0;
		sessionStorage.removeItem("workorderTabActive");
		this.isLoadingData = true;
		this.workordersdata = Array();
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			sessionStorage.setItem('backurl', '/cases-view/workorders/'+this.paramCaseId);
			let url = this.utility.apiData.userWorkOrders.ApiUrl;

			let caseId = this.paramCaseId;
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.GetAllDataWork = JSON.parse(Response.toString());
					if(this.GetAllDataWork.length == '0')
					{
						this.isLoadingData = false;
					}
					this.GetAllDataWork.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
					this.workordersdata = Array();
					for(var k = 0; k < this.GetAllDataWork.length; k++)
					{
						this.workordersdata.push({
						  id: k,
						  resourceOwner: this.GetAllDataWork[k].resourceOwner,
						  dateCreated: this.GetAllDataWork[k].dateCreated,
						  presentStatus: this.GetAllDataWork[k].presentStatus,
						  startdate: this.GetAllDataWork[k].startdate,
						  workorderId: this.GetAllDataWork[k].workorderId,
						  patientName: this.GetAllDataWork[k].patientName,
						  caseId: this.GetAllDataWork[k].caseId,
						  patientId: this.GetAllDataWork[k].patientId,
						  toothguide: this.GetAllDataWork[k].toothguide,
						  enddate: this.GetAllDataWork[k].enddate,
						  notes: this.GetAllDataWork[k].notes,
						  dateUpdated: this.GetAllDataWork[k].dateUpdated,
						  milestoneId: this.GetAllDataWork[k].milestoneId,
						  title: this.GetAllDataWork[k].title,
						  caseTitle: '',
						  memberName: '',
						  milestoneTitle: ''
						});
						this.getuserdetailsallCase(this.GetAllDataWork[k].members,this.GetAllDataWork[k].milestoneId,k,'workorder');
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
				swal('Workorder title already exist!');
				else if (error.status === 405)
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
		}
	}
	
	addReferal(caseId: any) {
		sessionStorage.setItem('checkCase', '1');
		sessionStorage.setItem('checkmilestoneidref', '');
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['referral/referral-add']);
	}
	addWorkOrders(caseId: any) {
		sessionStorage.setItem('checkCase', '1');
		sessionStorage.setItem('checkmilestoneid', '');
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['work-orders/work-order-add']);
	}
	editWorkOrders(workorderId: any) {
		//sessionStorage.setItem('workorderId', workorderId);
		this.router.navigate(['work-orders/work-order-edit/'+workorderId]);
	}
	
	viewWorkorders(workorderId: any) {
		//sessionStorage.setItem('workorderId', workorderId);
		this.router.navigate(['work-orders/work-order-details/'+workorderId]);
	}
	getallmilestone() {
		sessionStorage.removeItem("milestoneTabActive");
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			/* swal("Processing...please wait...", {
				buttons: [false, false],
				closeOnClickOutside: false,
			}); */
			sessionStorage.setItem('backurl', '/cases-view/milestones/'+this.paramCaseId);
			let url = this.utility.apiData.userMilestones.ApiUrl;
			let caseId = this.paramCaseId;
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.isLoadingData = false;
					this.milestonedata = JSON.parse(Response.toString()).reverse();
					this.eventsData = Array();
					for(var i = 0; i < this.milestonedata.length; i++)
					{
						this.eventsData.push({
						  title: this.milestonedata[i].title,
						  start: new Date(this.milestonedata[i].startdate),
						  end: new Date(this.milestonedata[i].duedate)
						});
					}
					this.calendarOptions = {
						initialView: 'dayGridMonth',
						themeSystem: 'bootstrap5',
						headerToolbar:{
						  left: "prev,next today",
						  center: "title",
						  right: "dayGridMonth,timeGridWeek,listMonth"
						},
						dayMaxEvents: true,
						displayEventEnd:true,
						events: this.eventsData
					};
				}
			}, (error) => {
				if (error.status === 404)
				swal('No milestone found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Milestone title already exist!');
				else if (error.status === 405)
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
		}
	}
	
	viewmilestone(milestoneId: any) {
		//sessionStorage.setItem('milestoneId', milestoneId);
		this.router.navigate(['milestones/milestone-details/'+milestoneId]);
	}
	deletemilestone(milestoneId: any) {
		let url = this.utility.apiData.userMilestones.ApiUrl;
		this.dataService.deleteDataRecord(url, milestoneId, 'milestoneId').subscribe(Response => {
			swal("Milestones deleted successfully");
			this.getallmilestone();
		}, (error) => {
			if (error.status === 404)
			swal('No milestone found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Milestone already exist!');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		  return false;
		});
	}
	editMilestone(milestoneId: any) {
		//sessionStorage.setItem('milestoneId', milestoneId);
		this.router.navigate(['milestones/milestone-edit/'+milestoneId]);
	}
	
	editcase(caseId: any) {
		//sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['/cases/case-edit/'+caseId]);
	}
	getCaseDetails() {
		//tabledata.fetchedData = '';
		this.tabledata = '';
		sessionStorage.setItem('backurl', '/cases-view/caseDetails/'+this.paramCaseId);
		/* swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		}); */
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = this.paramCaseId;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				if(this.paramTabName == 'caseDetails')
				{
				this.isLoadingData = false;
				}
				this.tabledata = JSON.parse(Response.toString());
				let patientId = this.tabledata.patientId;
				this.caseDate = this.tabledata.dateCreated;
				this.paramPatientId = this.tabledata.patientId;
				this.getallPatient();
				this.setCaseType(this.tabledata.caseType);
				if(this.tabledata.description.text)
				{
				this.caseDescription = this.tabledata.description.text;
				this.cvfastText = true;
				}
				this.setcvFast(this.tabledata.description);
				if(user.emailAddress == this.tabledata.resourceOwner){
					this.caseEdit = true;
				}
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	
	getallPatient() {
		let url = this.utility.apiData.userPatients.ApiUrl;
		let patientId = this.paramPatientId;
		if(patientId != '')
		{
			url += "?patientId="+patientId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.patientdata = JSON.parse(Response.toString());    
				if(this.patientdata.image)
				{
					this.setcvImage(this.patientdata.image);
				}
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	setCaseType(obj: any)
	{
		if(obj.length > 0)
		{
			for(var i = 0; i < obj.length; i++)
			{
				let getType = this.getDimensionsByFilter(obj[i]);
				if(this.CaseTypeVal)
				{
					this.CaseTypeVal += ", "+getType[0].name;
				}
				else
				{
					this.CaseTypeVal += getType[0].name;
				}
			}
		}
	}
	getDimensionsByFilter(id: any){
	  return this.casetype.filter(x => x.id === id);
	}
	setcvFast(obj: any, page = 'case')
	{
		if(page == 'case')
		{
			this.attachmentFiles = Array();
			if(JSON.stringify(obj).length > 2)
			{
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
							swal('No patient found');
							else if (error.status === 403)
							swal('You are unauthorized to access the data');
							else if (error.status === 400)
							swal('Invalid data provided, please try again');
							else if (error.status === 401)
							swal('You are unauthorized to access the page');
							else if (error.status === 409)
							swal('Duplicate data entered for first name or last name');
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
		}
		else
		{
			if(JSON.stringify(obj).length > 2)
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
							swal('No patient found');
							else if (error.status === 403)
							swal('You are unauthorized to access the data');
							else if (error.status === 400)
							swal('Invalid data provided, please try again');
							else if (error.status === 401)
							swal('You are unauthorized to access the page');
							else if (error.status === 409)
							swal('Duplicate data entered for first name or last name');
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
					this.filesdata = this.casefilesArray;
				}
			}
		}
	}
	setcvImage(img: any)
	{
		let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+img+'&module='+this.module+'&type=get';
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.patientImg = Response;
				this.caseImage = true;
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	getUniqueName(name: any) {
		let i = 0;
		do {
		  if (i > 0) name = name.split('.')[0] + '_' + i + '.' + name.split('.')[1];
		  i++;
		} while ('');
		return name;
	}
	
	loadFiles(event : any) {
		if (event.target.files.length > 0) {
		  let allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel'];
		if (!allowedtypes.some(type => event.target.files[0]['type'].includes(type))) {
		  swal("File Extenion Not Allowed");
		  return;
		} else {
		  this.attachmentUploadFiles = Array();
		  this.attachmentUploadFiles.push({ name: this.getUniqueName(event.target.files[0]['name']), binaryData: event.target.files[0], size: event.target.files[0]['size'], type: event.target.files[0]['type'] });
		}
		}
	}
	
	
	onGetdateData(data: any)
	{
		this.jsonObj['ownerName'] = data.resorceowner;
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		this.jsonObj['patientName'] = data.patientname;
		if(data.uploadfile)
		{
			this.jsonObj['files'] = this.UploadFiles;
		}
		
		this.dataService.postData(this.utility.apiData.userCaseFiles.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  swal('Files added successfully');
		  this.getFilesListing();
		  //window.location.reload();
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	
	onSubmitFiles(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		
		if(form.value.uploadfile)
		{
			if(this.attachmentUploadFiles.length > 0)
			{
				this.sending = true;
				let mediatype= this.attachmentUploadFiles[0].type;
				let mediasize= Math.round(this.attachmentUploadFiles[0].size/1024);
				let requests = this.attachmentUploadFiles.map((object) => {
				  return this.UtilityDev.uploadBinaryData(object["name"], object["binaryData"], this.module);
				});
				Promise.all(requests)
				  .then((values) => {
					this.attachmentUploadFiles = [];
					//console.log(this.cvfast);
					let img = values[0];
					let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+img+'&module='+this.module+'&type=get';
					this.dataService.getallData(url, true)
					.subscribe(Response => {
						if (Response)
						{
							this.sending = false;
							this.UploadFiles = Array();
							this.UploadFiles.push({
							  url: Response,
							  name: img,
							  mediaType: mediatype,
							  mediaSize: mediasize.toString()
							});
							//this.PatientImg = values[0];
							this.onGetdateData(form.value);
						}
					}, error => {
						if (error.status === 404)
						swal('No patient found');
						else if (error.status === 403)
						swal('You are unauthorized to access the data');
						else if (error.status === 400)
						swal('Invalid data provided, please try again');
						else if (error.status === 401)
						swal('You are unauthorized to access the page');
						else if (error.status === 409)
						swal('Duplicate data entered for first name or last name');
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
				  })
				  .catch((error) => {
					console.log(error);
					return false;
				  });
			}
		}
		else{
			this.onGetdateData(form.value);
		}
	};
	groupByKey(array: any, key: any) {
	   return array
		 .reduce((hash: any, obj: any) => {
		   if(obj[key] === undefined) return hash; 
		   return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
		 }, {})
	}

	getFilesListing() {
		this.isLoadingData = true;
		sessionStorage.setItem('backurl', '/master/master-list/'+this.paramCaseId+'/files');
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		let caseId = this.paramCaseId;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.isLoadingData = false;
				this.filesdataArray = JSON.parse(Response.toString()).reverse();
				this.casefilesArray = Array();
				let casefilesDate = Array();
				if(this.filesdataArray.length > 0)
				{
					for(var i = 0; i < this.filesdataArray.length; i++)
					{
						casefilesDate.push({
						  checkdate: new Date(this.filesdataArray[i].dateCreated).toLocaleDateString("en-US")
						});
						let createddate = new Date(this.filesdataArray[i].dateCreated).toLocaleDateString("en-US");
						var isPresent = this.casefilesArray.some(function(el){
						return el.checkdate === createddate
						});
						if(isPresent == false)
						{
						this.casefilesArray.push({
						  checkdate: createddate,
						  dateCreated: this.filesdataArray[i].dateCreated,
						  patientId: this.filesdataArray[i].patientId,
						  files: this.filesdataArray[i].files,
						  caseId: this.filesdataArray[i].caseId,
						  fileUploadId: this.filesdataArray[i].fileUploadId,
						  ownerName: this.filesdataArray[i].resourceOwner,
						  filecount: 1,
						});
						}
					}
					for(var k = 0; k < this.casefilesArray.length; k++)
					{
						let count = this.getFilesCount(casefilesDate,this.casefilesArray[k].checkdate);
						this.casefilesArray[k].filecount = count;
					}
					this.setcvFast(this.casefilesArray,'file');
				}
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	getFilesCount(array, id) {
	return array.filter((obj) => obj.checkdate === id).length;
	}
	getFilesDetails() {
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		let fileUploadId = sessionStorage.getItem("fileUploadId");
		if(fileUploadId != '')
		{
			url += "?fileUploadId="+fileUploadId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.uploaddata = JSON.parse(Response.toString());
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	
	onSubmit(form: NgForm) {
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		let strName = form.value.ownerName;
		let ownerName =strName.split(' ');
		if(ownerName[0] != '')
		{
			url += "?ownerName="+ownerName[0];
		}
		//let fileUploadId = sessionStorage.getItem("fileUploadId");
		//if(fileUploadId != '')
		//{
			//url += "?fileUploadId="+fileUploadId;
		//}
		if(ownerName.length > 1)
		{
			if(ownerName[1] != '')
			{
				if(ownerName[0] != '')
				{
					url += "&lastName="+ownerName[1];
				}
				else
				{
					url += "?lastName="+ownerName[1];
				}
			}
		}
		
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.filesdata = JSON.parse(Response.toString());
				
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	};
	addMilestone(caseId: any) {
		sessionStorage.setItem('checkCase', '1');
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['milestones/milestone-add']);
	}
	
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	onSubmitMilestone(form: NgForm) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userMilestones.ApiUrl;
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
			if(form.value.patientId != '')
			{
				if(patientName != '' || form.value.patientId != '')
				{ 
					url += "&patientId="+Date.parse(form.value.patientId);
				}
				else
				{
					url += "?patientId="+Date.parse(form.value.patientId);
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
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.milestonedata = JSON.parse(Response.toString()).reverse();
					this.eventsData = Array();
					for(var i = 0; i < this.milestonedata.length; i++)
					{
						this.eventsData.push({
						  title: this.milestonedata[i].title,
						  start: new Date(this.milestonedata[i].startdate),
						  end: new Date(this.milestonedata[i].duedate)
						});
					}
					this.calendarOptions = {
						initialView: 'dayGridMonth',
						themeSystem: 'bootstrap5',
						headerToolbar:{
						  left: "prev,next today",
						  center: "title",
						  right: "dayGridMonth,timeGridWeek,listMonth"
						},
						dayMaxEvents: true,
						displayEventEnd:true,
						events: this.eventsData
					};
				}
			}, (error) => {
				if (error.status === 404)
				swal('No milestone found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('milestone title already exist!');
				else if (error.status === 405)
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
		}
	}
	
	getReferralListing() {
		this.iscount = 0;
		sessionStorage.removeItem("referralTabActive");
		this.referraldata = Array();
		this.isLoadingData = true;
		sessionStorage.setItem('backurl', '/cases-view/referrals/'+this.paramCaseId);
		let url = this.utility.apiData.userReferrals.ApiUrl;
		let caseId = this.paramCaseId;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.GetAllDataReferral = JSON.parse(Response.toString());
				if(this.GetAllDataReferral.length == '0')
				{
					this.isLoadingData = false;
				}
				this.GetAllDataReferral.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
				this.referraldata = Array();
				for(var k = 0; k < this.GetAllDataReferral.length; k++)
				{
					this.referraldata.push({
					  id: k,
					  resourceOwner: this.GetAllDataReferral[k].resourceOwner,
					  dateCreated: this.GetAllDataReferral[k].dateCreated,
					  presentStatus: this.GetAllDataReferral[k].presentStatus,
					  startdate: this.GetAllDataReferral[k].startdate,
					  referralId: this.GetAllDataReferral[k].referralId,
					  patientName: '',
					  caseId: this.GetAllDataReferral[k].caseId,
					  patientId: this.GetAllDataReferral[k].patientId,
					  toothguide: this.GetAllDataReferral[k].toothguide,
					  enddate: this.GetAllDataReferral[k].enddate,
					  notes: this.GetAllDataReferral[k].notes,
					  dateUpdated: this.GetAllDataReferral[k].dateUpdated,
					  milestoneId: this.GetAllDataReferral[k].milestoneId,
					  title: this.GetAllDataReferral[k].title,
					  caseTitle: '',
					  memberName: '',
					  milestoneTitle: ''
					});
					//this.getcasedtls(GetAllData[k].caseId,k);
					this.getuserdetailsallCase(this.GetAllDataReferral[k].members,this.GetAllDataReferral[k].milestoneId,k,'referal');
				}
			}
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	
	viewReferralDetails(referralId: any) {
		//sessionStorage.setItem('referralId', referralId);
		this.router.navigate(['referral/referral-details/'+referralId]);
	}
	
	deletereferral(referralId: any) {
		let url = this.utility.apiData.userReferrals.ApiUrl;
		this.dataService.deleteDataRecord(url, referralId, 'referralId').subscribe(Response => {
			swal("Referral deleted successfully");
			this.getReferralListing();
		}, (error) => {
			if (error.status === 404)
			swal('No referal found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Referal title already exist');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		  return false;
		});
	}
	editReferrals(referralId: any) {
		//sessionStorage.setItem('referralId', referralId);
		this.router.navigate(['referral/referral-edit/'+referralId]);
	}
	
	onSubmitReferral(form: NgForm) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userReferrals.ApiUrl;
			
			if(form.value.title != '')
			{
				url += "?title="+form.value.title;
			}
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.referraldata = JSON.parse(Response.toString());
					this.referraldata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)
					this.calendarOptions = {
						initialView: 'dayGridMonth',
						themeSystem: 'bootstrap5',
						headerToolbar:{
						  left: "prev,next today",
						  center: "title",
						  right: "dayGridMonth,timeGridWeek,listMonth"
						},
						dayMaxEvents: true,
						displayEventEnd:true,
						events: this.eventsData
					};
				}
			}, (error) => {
				if (error.status === 404)
				swal('No referal found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Referal title already exist!');
				else if (error.status === 405)
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
		}
	}
	onSubmitComment(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.sending = true;
		this.jsonObjmsg['caseId'] = form.value.CcaseId;
		this.jsonObjmsg['patientId'] = form.value.CpatientId;
		this.jsonObjmsg['patientName'] = form.value.CpatientName;
		this.jsonObjmsg['messageId'] = form.value.CmessageId;
		this.jsonObjmsg['comment'] = this.messageDataArray[form.value.Ccomments].messagecomment;
		this.jsonObjmsg['messageType'] = '1';
		this.jsonObjmsg['messageReferenceId'] = "31313";
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Comments added successfully', '', 'put', '','comments', '','Comments already exists.').then(
		(value) => {
		this.sending = false;
		this.showComment = -1;
		this.getThread();
		},
		(error) => {
		this.sending = false;
		this.showComment = -1;
		this.getThread();
		});
	};
	onSubmitMessage(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.sending = true;
		this.jsonObjmsg['caseId'] = form.value.caseId;
		this.jsonObjmsg['patientId'] = form.value.patientId;
		this.jsonObjmsg['patientName'] = form.value.patientName;
		this.jsonObjmsg['message'] = this.cvfastval.returnCvfast();
		this.jsonObjmsg['messageType'] = '1';
		this.jsonObjmsg['messageReferenceId'] = "31313";
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Message added successfully', '', 'post', '','message', '','Message already exists.').then(
		(value) => {
		this.sending = false;
		this.showComment = -1;
		this.getThread();
		},
		(error) => {
		this.sending = false;
		this.showComment = -1;
		this.getThread();
		});
	};
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let Colleague = JSON.parse(Response.toString());
			this.allMember = Array();
			let checkInviteEmail = this.inviteEmailArray;
			for(var k = 0; k < Colleague.length; k++)
			{
				if (checkInviteEmail.includes(Colleague[k].emailAddress)) {
				}
				else{
					if(user.emailAddress != Colleague[k].emailAddress)
					{
						let name = Colleague[k].accountfirstName+' '+Colleague[k].accountlastName;
						let avatar = ''
						if((Colleague[k].imageSrc != undefined) && (Colleague[k].imageSrc != '') && (Colleague[k].imageSrc != null))
						{
						avatar = 'https://dentallive-accounts.s3-us-west-2.amazonaws.com/'+Colleague[k].imageSrc;
						}
						else
						{
						avatar = 'assets/images/users.png';
						}
						this.allMember.push({
						  id: k,
						  avatar: avatar,
						  emailAddress: Colleague[k].emailAddress,
						  dentalId: Colleague[k].dentalId,
						  name: name
						});
					}
				}
			}
		}
		}, (error) => {
			if (error.status === 404)
			swal('No user found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('User already exist!');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		  return false;
		});
		}
	}
	selectEvent(item: any) {
		this.allMemberEmail = Array();
		this.allMemberName = Array();
		this.allMemberDentalId = Array();
		for(var k = 0; k < item.length; k++)
		{
			this.allMemberEmail.push(item[k].emailAddress);
			this.allMemberName.push(item[k].name);
			this.allMemberDentalId.push(item[k].dentalId);
		}
	}
	
	
	onSubmitInvite(form: NgForm){
		let user = this.usr.getUserDetails(false);
		if(this.allMemberEmail.length == 0)
		{
			this.isvalidDate =true;
			this.sending = false;
		}
		else
		{
			this.isvalidDate =false;
		}
		if ((form.invalid) || (this.isvalidDate == true)) {
		  swal("Please enter values for the mandatory fields");
		  form.form.markAllAsTouched();
		  return;
		}
		swal("Processing...please wait...", {
			buttons: [false, false],
			closeOnClickOutside: false,
		});
		this.Invitememberlist(form.value,this.allMemberEmail);
	};
	Invitememberlist(data: any, obj){
		let user = this.usr.getUserDetails(false);
		var i = 0;
		//this.jsonObjInvite['resourceOwner'] = user.emailAddress;
		this.jsonObjInvite['caseId'] = data.caseId;
		this.jsonObjInvite['patientId'] = data.patientId;
		this.jsonObjInvite['patientName'] = data.patientName;
		this.jsonObjInvite['presentStatus'] = 0;
		this.jsonObjInvite['invitedUserMail'] = obj[i];
		this.jsonObjInvite['invitedUserId'] = this.allMemberDentalId[i];
		if(obj.length == 1)
		{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, 'Invitation send successfully', '', 'post', '','invitationText', '','User already invited.').then(
			(value) => {
			swal.close();
			this.sending = false;
			this.getInviteListing();
			},
			(error) => {
			swal.close();
			this.sending = false;
			this.getInviteListing();
			});
		}
		else
		{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, '', '', 'post', '','invitationText','','User already invited.').then(
			(value) => {
			this.allMemberEmail.splice(i, 1);
			this.Invitememberlist(data,this.allMemberEmail);
			},
			(error) => {
			this.allMemberEmail.splice(i, 1);
			this.Invitememberlist(data,this.allMemberEmail);
			});
		}
	};
	GetAllDataInvite:any;
	getInviteListing() {
		this.invitedata = Array();
		this.isLoadingData = true;
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		let caseId = this.paramCaseId;
		//alert(caseId);
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		//url += "&resourceOwner="+user.emailAddress;
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.GetAllDataInvite = JSON.parse(Response.toString());
				if(this.GetAllDataInvite.length == '0')
				{
					this.isLoadingData = false;
					this.getAllMembers();
				}
				this.GetAllDataInvite.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				this.invitedata = Array();
				this.inviteEmailArray = Array();
				for(var k = 0; k < this.GetAllDataInvite.length; k++)
				{
					this.invitedata.push({
					  id: k,
					  patientId: this.GetAllDataInvite[k].patientId,
					  invitedUserId: this.GetAllDataInvite[k].invitedUserId,
					  invitedUserMail: this.GetAllDataInvite[k].invitedUserMail,
					  invitationId: this.GetAllDataInvite[k].invitationId,
					  userName: '',
					  presentStatus: this.GetAllDataInvite[k].presentStatus,
					  invitationText: this.GetAllDataInvite[k].invitationText,
					  patientName: this.GetAllDataInvite[k].patientName,
					  caseId: this.GetAllDataInvite[k].caseId,
					  dateUpdated: this.GetAllDataInvite[k].dateUpdated,
					  resourceOwner: this.GetAllDataInvite[k].resourceOwner
					});
					this.inviteEmailArray.push(this.GetAllDataInvite[k].invitedUserMail);
					this.getuserdetailsall(this.GetAllDataInvite[k].invitedUserMail,k);
				}
				
			}
		}, error => {
			
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
			let name = userData.accountfirstName+' '+userData.accountlastName;
			this.invitedata[index].userName = name;
			this.invitedata[index].userEducation = userData.education;
			this.invitedata[index].userCity = userData.city;
			this.invitedata[index].userCountry = userData.country;
			if(this.GetAllDataInvite.length == (index+1))
			{
				this.getAllMembers();
				this.isLoadingData = false;
			}
		}
		}, (error) => {
			if (error.status === 404)
			swal('No user found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('User already exist!');
			else if (error.status === 405)
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		  return false;
		});
		}
	}
	removeInvitaion(invitationId: any, patientId: any, caseId: any, patientName: any, invitedUserMail: any, invitedUserId: any){
		this.jsonObjInviteEdit['patientId'] = patientId;
		this.jsonObjInviteEdit['caseId'] = caseId;
		this.jsonObjInviteEdit['patientName'] = patientName;
		this.jsonObjInviteEdit['invitedUserMail'] = invitedUserMail;
		this.jsonObjInviteEdit['invitedUserId'] = invitedUserId;
		this.jsonObjInviteEdit['invitationId'] = invitationId;
		this.jsonObjInviteEdit['presentStatus'] = 3;
		
		
		this.dataService.putData(this.utility.apiData.userCaseInvites.ApiUrl, JSON.stringify(this.jsonObjInviteEdit), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  this.getInviteListing();
		  swal("Case invitation removed successfully");
		}, error => {
			if (error.status === 404)
			swal('No patient found');
			else if (error.status === 403)
			swal('You are unauthorized to access the data');
			else if (error.status === 400)
			swal('Invalid data provided, please try again');
			else if (error.status === 401)
			swal('You are unauthorized to access the page');
			else if (error.status === 409)
			swal('Duplicate data entered for first name or last name');
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
	
	getThread() {
		this.isLoadingData = true;
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userThreads.ApiUrl;
			let caseId = this.paramCaseId;
			let toDate: Date = new Date();
			this.fromDate.setDate(this.fromDate.getDate() - 14);
			this.fromDate.setHours(0);
			this.fromDate.setMinutes(0);
			this.fromDate.setSeconds(0);
			this.fromDate.setMilliseconds(0);
			url += "?caseId="+caseId;
			url += "&dateTo="+toDate.getTime();
			url += "&dateFrom="+this.fromDate.getTime();
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let treadAllData = JSON.parse(Response.toString());
					treadAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
					//alert(JSON.stringify(treadAllData));
					this.messageDataArray = Array();
					let countIndex = 0;
					for(var i = 0; i < treadAllData.length; i++)
					{
						let skVal = treadAllData[i].sk;
						if((skVal != undefined) && (skVal != '') && (skVal != null)) {
						var skarray = skVal.split("#");
						if(skarray[0] == 'MESSAGES')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: treadAllData[i].messageId,
								messagetext: this.removeHTML(treadAllData[i].message.text),
								messageimg: '',
								messagecomment: treadAllData[i].comments,
								messagecomments: ''
							});
							this.setcvFastComment(treadAllData[i].comments,countIndex);
							this.setcvFastMsg(treadAllData[i].message,countIndex);
							this.cvfastMsgText = true;
						}
						else if(skarray[0] == 'CASEINVITES')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'CASEINVITES#  : '+this.removeHTML(treadAllData[i].invitationText.text)+' ('+treadAllData[i].invitedUserMail+')',
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
							this.setcvFastMsg(treadAllData[i].invitationText,countIndex);
							this.cvfastMsgText = true;
						}
						else if(skarray[0] == 'DETAILS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'DETAILS#  : '+this.removeHTML(treadAllData[i].title),
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
							this.setcvFastMsg(treadAllData[i].description,countIndex);
							this.cvfastMsgText = true;
						}
						else if(skarray[0] == 'WORKORDERS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'WORKORDERS#  : '+this.removeHTML(treadAllData[i].title),
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
							this.setcvFastMsg(treadAllData[i].notes,countIndex);
							this.cvfastMsgText = true;
						}
						else if(skarray[0] == 'MILESTONES')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'MILESTONES#  : '+this.removeHTML(treadAllData[i].title),
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
							this.setcvFastMsg(treadAllData[i].description,countIndex);
							this.cvfastMsgText = true;
						}
						else if(skarray[0] == 'REFERRALS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'REFERRALS#  : '+this.removeHTML(treadAllData[i].title),
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
							//this.setcvFastMsg(treadAllData[i].description,countIndex);
							this.cvfastMsgText = true;
						}
						else if(skarray[0] == 'TASKS')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'TASKS#  : '+this.removeHTML(treadAllData[i].title),
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
							this.setcvFastMsg(treadAllData[i].description,countIndex);
							this.cvfastMsgText = true;
						}
						else if(skarray[0] == 'FILES')
						{
							this.messageDataArray.push({
								patientId: treadAllData[i].patientId,
								caseId: treadAllData[i].caseId,
								patientName: treadAllData[i].resourceOwner,
								dateUpdated: treadAllData[i].dateUpdated,
								dateCreated: treadAllData[i].dateCreated,
								messageId: '',
								messagetext: 'Files Uploaded',
								messageimg: '',
								messagecomment: '',
								messagecomments: ''
							});
							this.setcvFastMsg(treadAllData[i].files,countIndex,'files');
							this.cvfastMsgText = true;
						}
							countIndex++;
						}
						if(treadAllData.length == (i+1))
						{
							this.isLoadingData = false;
							this.messageAry = this.messageDataArray;
						}
					}
				}
			}, (error) => {
				if (error.status === 404)
				swal('No thread found');
				else if (error.status === 403)
				swal('You are unauthorized to access the data');
				else if (error.status === 400)
				swal('Invalid data provided, please try again');
				else if (error.status === 401)
				swal('You are unauthorized to access the page');
				else if (error.status === 409)
				swal('Duplicate data entered');
				else if (error.status === 405)
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
			
		}
	}
	onScrollDown(ev: any, toDate) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			if(this.caseDate <= toDate.getTime())
			{
				let url = this.utility.apiData.userThreads.ApiUrl;
				let caseId = sessionStorage.getItem("caseId");
				let GetToDate = toDate.getTime();
				this.fromDate = toDate;
				this.fromDate.setDate(this.fromDate.getDate() - 14);
				this.fromDate.setHours(0);
				this.fromDate.setMinutes(0);
				this.fromDate.setSeconds(0);
				this.fromDate.setMilliseconds(0);
				url += "?caseId="+caseId;
				url += "&dateFrom="+this.fromDate.getTime();
				url += "&dateTo="+GetToDate;
				this.dataService.getallData(url, true).subscribe(Response => {
					if (Response)
					{
						let treadAllData = JSON.parse(Response.toString());
						treadAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
						let countIndex = 0;
						for(var i = 0; i < treadAllData.length; i++)
						{
							let skVal = treadAllData[i].sk;
							if((skVal != undefined) && (skVal != '') && (skVal != null)) {
							var skarray = skVal.split("#");
								if(skarray[0] == 'MESSAGES')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: treadAllData[i].messageId,
										messagetext: this.removeHTML(treadAllData[i].message.text),
										messageimg: '',
										messagecomment: treadAllData[i].comments,
										messagecomments: ''
									});
									this.setcvFastComment(treadAllData[i].comments,countIndex);
									this.setcvFastMsg(treadAllData[i].message,countIndex);
									this.cvfastMsgText = true;
								}
								else if(skarray[0] == 'CASEINVITES')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: '',
										messagetext: 'CASEINVITES#  : '+this.removeHTML(treadAllData[i].invitationText.text)+' ('+treadAllData[i].invitedUserMail+')',
										messageimg: '',
										messagecomment: '',
										messagecomments: ''
									});
									this.setcvFastMsg(treadAllData[i].invitationText,countIndex);
									this.cvfastMsgText = true;
								}
								else if(skarray[0] == 'DETAILS')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: '',
										messagetext: 'DETAILS#  : '+this.removeHTML(treadAllData[i].title),
										messageimg: '',
										messagecomment: '',
										messagecomments: ''
									});
									this.setcvFastMsg(treadAllData[i].description,countIndex);
									this.cvfastMsgText = true;
								}
								else if(skarray[0] == 'WORKORDERS')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: '',
										messagetext: 'WORKORDERS#  : '+this.removeHTML(treadAllData[i].title),
										messageimg: '',
										messagecomment: '',
										messagecomments: ''
									});
									this.setcvFastMsg(treadAllData[i].notes,countIndex);
									this.cvfastMsgText = true;
								}
								else if(skarray[0] == 'MILESTONES')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: '',
										messagetext: 'MILESTONES#  : '+this.removeHTML(treadAllData[i].title),
										messageimg: '',
										messagecomment: '',
										messagecomments: ''
									});
									this.setcvFastMsg(treadAllData[i].description,countIndex);
									this.cvfastMsgText = true;
								}
								else if(skarray[0] == 'REFERRALS')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: '',
										messagetext: 'REFERRALS#  : '+this.removeHTML(treadAllData[i].title),
										messageimg: '',
										messagecomment: '',
										messagecomments: ''
									});
									//this.setcvFastMsg(treadAllData[i].description,countIndex);
									this.cvfastMsgText = true;
								}
								else if(skarray[0] == 'TASKS')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: '',
										messagetext: 'TASKS#  : '+this.removeHTML(treadAllData[i].title),
										messageimg: '',
										messagecomment: '',
										messagecomments: ''
									});
									this.setcvFastMsg(treadAllData[i].description,countIndex);
									this.cvfastMsgText = true;
								}
								else if(skarray[0] == 'FILES')
								{
									this.messageDataArray.push({
										patientId: treadAllData[i].patientId,
										caseId: treadAllData[i].caseId,
										patientName: treadAllData[i].resourceOwner,
										dateUpdated: treadAllData[i].dateUpdated,
										dateCreated: treadAllData[i].dateCreated,
										messageId: '',
										messagetext: 'Files Uploaded',
										messageimg: '',
										messagecomment: '',
										messagecomments: ''
									});
									//this.setcvFastMsg(treadAllData[i].description,countIndex);
									this.cvfastMsgText = true;
								}
								countIndex++;
							}
							if(treadAllData.length == (i+1))
							{
								this.messageAry = this.messageDataArray;
								this.messageAry.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
							}
						}
					}
				}, (error) => {
					if (error.status === 404)
					swal('No thread found');
					else if (error.status === 403)
					swal('You are unauthorized to access the data');
					else if (error.status === 400)
					swal('Invalid data provided, please try again');
					else if (error.status === 401)
					swal('You are unauthorized to access the page');
					else if (error.status === 409)
					swal('Duplicate data entered');
					else if (error.status === 405)
					swal('Due to dependency data unable to complete operation');
					else if (error.status === 500)
					swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
					else
					swal('Oops something went wrong, please try again');
				  return false;
				});
			}
		}
	}

	getallmilestoneCase(milestoneId, rowIndex, str) {
		return new Promise((Resolve, myReject) => {
			let user = this.usr.getUserDetails(false);
			if(user)
			{
				let url = this.utility.apiData.userMilestones.ApiUrl;
				if(milestoneId != '')
				{
					url += "?milestoneId="+milestoneId;
					this.dataService.getallData(url, true).subscribe(Response => {
						if (Response)
						{
							let milestoneData = JSON.parse(Response.toString());
							let title = milestoneData.title;
							if(str == 'workorder')
							{
								this.workordersdata[rowIndex].milestoneTitle = title;
								this.iscount++;
								Resolve(true);
							}
							if(str == 'referal')
							{
								this.referraldata[rowIndex].milestoneTitle = title;
								this.iscount++;
								Resolve(true);
							}
						}
					}, (error) => {
						Resolve(true);
						if (error.status === 404)
						swal('No milestone found');
						else if (error.status === 403)
						swal('You are unauthorized to access the data');
						else if (error.status === 400)
						swal('Invalid data provided, please try again');
						else if (error.status === 401)
						swal('You are unauthorized to access the page');
						else if (error.status === 409)
						swal('Milestone title already exist!');
						else if (error.status === 405)
						swal('Due to dependency data unable to complete operation');
						else if (error.status === 500)
						swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
						else
						swal('Oops something went wrong, please try again');
					  return false;
					});
				}
				else
				{
					if(str == 'workorder')
					{
						this.iscount++;
						Resolve(true);
					}
					if(str == 'referal')
					{
						this.iscount++;
						Resolve(true);
					}
				}
			}
		});
	}
	
	getuserdetailsallCase(userId, milestoneId, index, str) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let memberResult = '';
			let checkArray = 0;
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
					let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
					if(memberResult)
					{
						memberResult += ','+name;
					}
					else{
						memberResult += name;
					}
					checkArray++;
					if(checkArray == userId.length)
					{
						if(str == 'workorder')
						{
							this.workordersdata[index].memberName = memberResult;
							this.getallmilestoneCase(milestoneId,index,'workorder').then(
							(value) => {
								if(this.GetAllDataWork.length == this.iscount)
								{
									this.isLoadingData = false;
								}
							},
							(error) => {
								if(this.GetAllDataWork.length == this.iscount)
								{
									this.isLoadingData = false;
								}
							});
						}
						if(str == 'referal')
						{
							this.referraldata[index].memberName = memberResult;
							this.getallmilestoneCase(milestoneId,index,'referal').then(
							(value) => {
								if(this.GetAllDataReferral.length == this.iscount)
								{
									this.isLoadingData = false;
								}
							},
							(error) => {
								if(this.GetAllDataReferral.length == this.iscount)
								{
									this.isLoadingData = false;
								}
							});
						}
					}
				}
				}, (error) => {
					if (error.status === 404)
					swal('No user found');
					else if (error.status === 403)
					swal('You are unauthorized to access the data');
					else if (error.status === 400)
					swal('Invalid data provided, please try again');
					else if (error.status === 401)
					swal('You are unauthorized to access the page');
					else if (error.status === 409)
					swal('Duplicate data entered');
					else if (error.status === 405)
					swal('Due to dependency data unable to complete operation');
					else if (error.status === 500)
					swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
					else
					swal('Oops something went wrong, please try again');
				  return false;
				});
			}
		}
	}
	viewColleagueDetails(colleagueId: any,caseId: any) {
		this.router.navigate(['colleagues/colleague-view-profile/'+colleagueId+'/'+caseId]);
	}
	
	onSubmitInviteNew(form: NgForm){
		let user = this.usr.getUserDetails(false);
		
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		
		let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/sendinvite';
	
		url += "?caseId="+form.value.caseId+'&name='+form.value.name+'&email='+form.value.email;
		
		this.dataService.getallData(url, true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  swal('New member invited successfully');
		}, error => {
			swal({
				text: error.error
			}).then(function() {
				window.location.reload();
			});
		});
	};
	@ViewChild('videoPlayer') videoplayer: ElementRef;

	video() {
		this.videoplayer?.nativeElement.play();
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
	getFileName(fileName) {
		if (fileName.indexOf('__-__') == -1) return fileName
		let name = fileName.split(".");
		return fileName.substring(0, fileName.indexOf('__-__')) + "." + name[name.length - 1]
	}
}