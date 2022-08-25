import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';	
import { NgForm } from '@angular/forms';								
import { CalendarOptions } from '@fullcalendar/angular'; 
import swal from 'sweetalert2';
import { ApiDataService } from '../users/api-data.service';
import { UtilityService } from '../users/utility.service';
import { UtilityServicedev } from '../../../utilitydev.service';
import { AccdetailsService } from '../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../cvfast/cvfast.component';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	calendarOptions: CalendarOptions = {}
	
	public allMember: any[] = []
	public allMemberEmail: any[] = []
	public allMemberName: any[] = []
	public allMemberDentalId: any[] = []
    selectedCity = '';
	show = false;
	show1 = false;
	show2 = false;
	show3 = false;
	show4 = false;
	show5 = false;
	show6 = false;
	show7 = false;
	show8 = false;
	
	showComment: any;
	replyToggle(index){
		this.setMessageRpValue = false;
		this.showComment =index;
	}
 
	id:any = "listView";
	tabContent(ids:any){
		this.id = ids;
	}
	tab:any = "tab1";
	tabClick(tabs:any){
		this.tab = tabs;
		sessionStorage.setItem("masterTab", tabs);
	}
	
	saveCompletedArchive: boolean = false;
	setMessageValue: boolean = false;
	setMessageRpValue: boolean = false;
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	cvfastMsgText: boolean = false;
	cvfastMsgLinks: boolean = false;

	onCompletedArchiveChanged(value:boolean){
		this.saveCompletedArchive = value;
	}
	dtOptions: DataTables.Settings = {};
	public tabledata:any;
	public milestonedata:any;
	public workordersdata:any;
	public colleaguedata:any;
	public messagedata:any;
	public patientdata:any;
	public referraldata:any;
	public patientImg: any;
	public module = 'patient';
	public CaseTypeVal = '';
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
		presentStatus: 0,
		resourceOwner: ''
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
	
	constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router,private utilitydev: UtilityServicedev) { }
	

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
      }
    };
	//this.getMessage();
	this.getThread();
	this.getCaseDetails();
	this.getFilesListing();
	this.getallmilestone();
	this.getallworkorder();
	this.getReferralListing();
	this.getColleagueListing();
	this.getAllMembers();
	this.getInviteListing();
	//Set current tab
	let masterTab = sessionStorage.getItem("masterTab");
	(masterTab) ? this.tab = masterTab : this.tab = 'tab1';
	}

	getColleagueListing() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			/*var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
			swal.fire({
				html: sweet_loader,
				icon: "https://www.boasnotas.com/img/loading2.gif",
				showConfirmButton: false,
				allowOutsideClick: false,     
				closeOnClickOutside: false,
				timer: 2200,
				//icon: "success"
			});
			*/
			swal.fire({
				title: 'Loading....',
				showConfirmButton: false,
				timer: 2200
			});
			let url = this.utility.apiData.userColleague.ApiUrl;
			//let caseId = sessionStorage.getItem("caseId");			
			//if(caseId != '')
			//{
				//url += "?caseId="+caseId;
			//}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.colleaguedata = JSON.parse(Response.toString());
					//this.colleaguedata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)
					//alert(JSON.stringify(this.colleaguedata));
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	getMessage() {
		let user = this.usr.getUserDetails(false);
		
		if(user)
		{
			let url = this.utility.apiData.userMessage.ApiUrl;
			let caseId = sessionStorage.getItem("caseId");
			let messageType = "1";
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			url += "&messageType="+messageType;
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
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
			
		}
	}
	onSubmitMessages(form: NgForm){
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			//alert(JSON.stringify(form.value));
			let url = this.utility.apiData.userMessage.ApiUrl;
			let caseId = sessionStorage.getItem("caseId");
			let patientId = sessionStorage.getItem("patientId");
			
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
			//alert(url);
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
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	setcvFastComment(obj: any, index: any)
	{
		obj.links = '';
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
			setTimeout(() => 
			{
				this.messageDataArray[index].messageimg = MessageDetails;  
			},
			500);
		}
		
	}
  
	getallworkorder() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			/*var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
			swal.fire({
				html: sweet_loader,
				icon: "https://www.boasnotas.com/img/loading2.gif",
				showConfirmButton: false,
				allowOutsideClick: false,     
				closeOnClickOutside: false,
				timer: 2200,
				//icon: "success"
			});
			*/
			swal.fire({
				title: 'Loading....',
				showConfirmButton: false,
				timer: 2200
			});
			let url = this.utility.apiData.userWorkOrders.ApiUrl;

			let caseId = sessionStorage.getItem("caseId");
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.workordersdata = JSON.parse(Response.toString()).reverse();
					//alert(JSON.stringify(this.workordersdata));
					//alert(this.workordersdata['0'].title);
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	addReferal() {
		sessionStorage.setItem('checkCase', '1');
		sessionStorage.setItem('checkmilestoneidref', '');
		this.router.navigate(['referral/referral-add']);
	}
	addWorkOrders() {
		sessionStorage.setItem('checkCase', '1');
		sessionStorage.setItem('checkmilestoneid', '');
		this.router.navigate(['work-orders/work-order-add']);
	}
	editWorkOrders(workorderId: any) {
		sessionStorage.setItem('workorderId', workorderId);
		this.router.navigate(['work-orders/work-order-edit']);
	}
	
	viewWorkorders(workorderId: any) {
		sessionStorage.setItem('workorderId', workorderId);
		this.router.navigate(['work-orders/work-order-details']);
	}
	getallmilestone() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userMilestones.ApiUrl;
			let caseId = sessionStorage.getItem("caseId");
			if(caseId != '')
			{
				url += "?caseId="+caseId;
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
					//alert(this.milestonedata.length);
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
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	viewmilestone(milestoneId: any) {
		sessionStorage.setItem('milestoneId', milestoneId);
		this.router.navigate(['milestones/milestone-details']);
	}
	deletemilestone(milestoneId: any) {
		let url = this.utility.apiData.userMilestones.ApiUrl;
		this.dataService.deleteDataRecord(url, milestoneId, 'milestoneId').subscribe(Response => {
			swal.fire("Milestones deleted successfully");
			this.getallmilestone();
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
	}
	editMilestone(milestoneId: any) {
		sessionStorage.setItem('milestoneId', milestoneId);
		this.router.navigate(['milestones/milestone-edit']);
	}
	
	editcase(caseId: any) {
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['/cases/case-edit']);
	}
	getCaseDetails() {
		//tabledata.fetchedData = '';
		this.tabledata = '';
		/*var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
		swal.fire({
			html: sweet_loader,
			icon: "https://www.boasnotas.com/img/loading2.gif",
			showConfirmButton: false,
			allowOutsideClick: false,     
			closeOnClickOutside: false,
			timer: 2200,
			//icon: "success"
		});
		*/
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2200
		});
		let url = this.utility.apiData.userCases.ApiUrl;
		let caseId = sessionStorage.getItem("caseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.tabledata = JSON.parse(Response.toString());
				this.getallPatient();
				let patientId = this.tabledata.patientId;
				this.setCaseType(this.tabledata.caseType);
				//alert(JSON.stringify(this.tabledata));
				this.setcvFast(this.tabledata.description);
				this.cvfastText = true;
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
	
	getallPatient() {
		let url = this.utility.apiData.userPatients.ApiUrl;
		let patientId = sessionStorage.getItem("patientId");
		if(patientId != '')
		{
			url += "?patientId="+patientId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.patientdata = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.patientdata.image));
				setTimeout(()=>{     
					if(this.patientdata.image)
					{
						this.setcvImage(this.patientdata.image);
					}
				}, 1000);
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
	setcvImage(img: any)
	{
		let url = 'https://hx4mf30vd7.execute-api.us-west-2.amazonaws.com/development/objectUrl?name='+img+'&module='+this.module+'&type=get';
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.patientImg = Response;
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
		  let allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel', 'docx', 'doc', 'xls', 'xlsx', 'txt'];
		if (!allowedtypes.some(type => event.target.files[0]['type'].includes(type))) {
		  swal.fire("File Extenion Not Allowed");
		  return;
		} else {
		  this.attachmentUploadFiles = Array();
		  this.attachmentUploadFiles.push({ name: this.getUniqueName(event.target.files[0]['name']), binaryData: event.target.files[0], size: event.target.files[0]['size'], type: event.target.files[0]['type'] });
		}
		}
	}
	
	
	onGetdateData(data: any)
	{
		//alert(data);
		this.jsonObj['ownerName'] = data.resorceowner;
		this.jsonObj['caseId'] = data.caseid;
		this.jsonObj['patientId'] = data.patientid;
		this.jsonObj['patientName'] = data.patientname;
		if(data.uploadfile)
		{
			this.jsonObj['files'] = this.UploadFiles;
		}
		//alert(JSON.stringify(this.jsonObj));
		
		this.dataService.postData(this.utility.apiData.userCaseFiles.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  swal.fire('Files added successfully');
		  //this.getFilesListing();
		  window.location.reload();
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
	
	onSubmitFiles(form: NgForm){
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		
		if(form.value.uploadfile)
		{
			/*var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
			swal.fire({
				html: sweet_loader,
				icon: "https://www.boasnotas.com/img/loading2.gif",
				showConfirmButton: false,
				allowOutsideClick: false,     
				closeOnClickOutside: false,
				timer: 2200,
				//icon: "success"
			});
			*/
			swal.fire({
				title: 'Loading....',
				showConfirmButton: false,
				timer: 2200
			});
			let mediatype= this.attachmentUploadFiles[0].type;
			let mediasize= Math.round(this.attachmentUploadFiles[0].size/1024);
			let requests = this.attachmentUploadFiles.map((object) => {
			  return this.utilitydev.uploadBinaryData(object["name"], object["binaryData"], this.module);
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
			  })
			  .catch((error) => {
				console.log(error);
				return false;
			  });
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
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		let caseId = sessionStorage.getItem("caseId");
		//alert(caseId);
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.filesdataArray = JSON.parse(Response.toString()).reverse();
				//alert(JSON.stringify(this.filesdataArray));
				this.casefilesArray = Array();
				let casefilesDate = Array();
				if(this.filesdataArray.length > 0)
				{
					for(var i = 0; i < this.filesdataArray.length; i++)
					{
						//alert(new Date(this.filesdataArray[i].dateCreated).toLocaleDateString("en-US"));
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
						  ownerName: this.filesdataArray[i].ownerName,
						  filecount: 1,
						});
						//alert(JSON.stringify(this.casefilesArray));
						}
					}
					for(var k = 0; k < this.casefilesArray.length; k++)
					{
						let count = this.getFilesCount(casefilesDate,this.casefilesArray[k].checkdate);
						this.casefilesArray[k].filecount = count;
					}
					this.setcvFast(this.casefilesArray,'file');
				}
				//this.filesdata = this.groupByKey(this.casefilesArray, 'checkdate');
				//alert(JSON.stringify(this.groupByKey(this.casefilesArray, 'checkdate')));
				//alert(JSON.stringify(this.groupByKey(this.casefilesArray, 'checkdate')));
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
	getFilesCount(array, id) {
	return array.filter((obj) => obj.checkdate === id).length;
	}
	getFilesDetails() {
		let url = this.utility.apiData.userCaseFiles.ApiUrl;
		let fileUploadId = sessionStorage.getItem("fileUploadId");
		//let fileUploadId = "013213d3-eb8c-446e-8a52-4aa8de59664d";
		//alert(fileUploadId);
		if(fileUploadId != '')
		{
			url += "?fileUploadId="+fileUploadId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.uploaddata = JSON.parse(Response.toString());
				//alert(JSON.stringify(this.uploaddata));
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
	
	viewFiles(dateCreated: any) {
		//let url = this.utility.apiData.userCaseFiles.ApiUrl;
		//this.dataService.deleteFilesData(url, fileUploadId).subscribe(Response => {
		//	swal.fire("Case Files deleted successfully");
		//	this.getFilesListing();
		//}, (error) => {
		//  swal.fire("Unable to fetch data, please try again");
		//  return false;
		//});
		
		sessionStorage.setItem('dateCreated', dateCreated);
		this.router.navigate(['files/files']);
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
				
				//alert(JSON.stringify(this.filesdata));
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
		//alert(11111111);
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			//alert(JSON.stringify(form.value));
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
					//alert(this.milestonedata.length);
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
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
		}
	}
	
	getReferralListing() {
		/*var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
		swal.fire({
			html: sweet_loader,
			icon: "https://www.boasnotas.com/img/loading2.gif",
			showConfirmButton: false,
			allowOutsideClick: false,     
			closeOnClickOutside: false,
			timer: 2200,
			//icon: "success"
		});
		*/
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2200
		});
		let url = this.utility.apiData.userReferrals.ApiUrl;
		let caseId = sessionStorage.getItem("caseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.referraldata = JSON.parse(Response.toString());
				this.referraldata.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)
				//alert(JSON.stringify(this.referraldata));
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
	
	viewReferralDetails(referralId: any) {
		sessionStorage.setItem('referralId', referralId);
		this.router.navigate(['referral/referral-details']);
	}
	
	deletereferral(referralId: any) {
		let url = this.utility.apiData.userReferrals.ApiUrl;
		this.dataService.deleteDataRecord(url, referralId, 'referralId').subscribe(Response => {
			swal.fire("Referral deleted successfully");
			this.getReferralListing();
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
	}
	editReferrals(referralId: any) {
		sessionStorage.setItem('referralId', referralId);
		this.router.navigate(['referral/referral-edit']);
	}
	
	onSubmitReferral(form: NgForm) {
		//alert(11111111);
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			//alert(JSON.stringify(form.value));
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
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
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
		this.jsonObjmsg['messageType'] = '1';
		this.jsonObjmsg['messageReferenceId'] = "31313";
		//alert(JSON.stringify(this.jsonObjmsg));
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Comments added successfully', 'cases/case-list', 'put', '','comments');
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
		this.jsonObjmsg['messageType'] = '1';
		this.jsonObjmsg['messageReferenceId'] = "31313";
		//alert(JSON.stringify(this.jsonObjmsg));
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Message added successfully', 'cases/case-list', 'post', '','message');
		//this.getMessage(this.tabledata.caseId);
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
			//alert(JSON.stringify(Colleague));
			this.allMember = Array();
			for(var k = 0; k < Colleague.length; k++)
			{
				if(user.emailAddress != Colleague[k].emailAddress)
				{
					let name = Colleague[k].accountfirstName+' '+Colleague[k].accountlastName;
					let avatar = ''
					if(Colleague[k].imageSrc != undefined)
					{
					avatar = 'https://dentallive-accounts.s3-us-west-2.amazonaws.com/'+Colleague[k].imageSrc;
					}
					else
					{
					avatar = '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x';
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
			//alert(JSON.stringify(this.allMember));
		}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
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
		//alert(JSON.stringify(this.allMemberEmail));
		//alert(JSON.stringify(this.allMemberDentalId));
	}
	
	onSubmitInvite(form: NgForm){
		let user = this.usr.getUserDetails(false);
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		var z=0;
		for(var i = 0; i < this.allMemberEmail.length; i++)
		{
			z++;
			this.jsonObjInvite['resourceOwner'] = user.dentalId;
			this.jsonObjInvite['caseId'] = form.value.caseId;
			this.jsonObjInvite['patientId'] = form.value.patientId;
			this.jsonObjInvite['patientName'] = form.value.patientName;
			this.jsonObjInvite['presentStatus'] = 0;
			if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
			{
				this.jsonObjInvite['invitationText'] = this.cvfastval.returnCvfast();
			}
			
			this.jsonObjInvite['invitedUserMail'] = this.allMemberEmail[i];
			this.jsonObjInvite['invitedUserId'] = this.allMemberDentalId[i];
			
			//alert(JSON.stringify(this.jsonObjInvite));
			if(z == this.allMemberEmail.length)
			{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, 'Invitation send successfully', 'cases/case-list', 'post', '','invitationText');
			}
			else
			{
			this.cvfastval.processFiles(this.utility.apiData.userCaseInvites.ApiUrl, this.jsonObjInvite, true, '', '', 'post', '','invitationText');
			}
		}
	};
	
	
	getInviteListing() {
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2200
		});
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		let caseId = sessionStorage.getItem("caseId");
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		url += "&resourceOwner="+user.dentalId;
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				this.invitedata = Array();
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedata.push({
					  id: k,
					  patientId: GetAllData[k].patientId,
					  invitedUserId: GetAllData[k].invitedUserId,
					  invitedUserMail: GetAllData[k].invitedUserMail,
					  invitationId: GetAllData[k].invitationId,
					  userName: '',
					  presentStatus: GetAllData[k].presentStatus,
					  invitationText: GetAllData[k].invitationText,
					  patientName: GetAllData[k].patientName,
					  caseId: GetAllData[k].caseId,
					  dateUpdated: GetAllData[k].dateUpdated,
					  resourceOwner: GetAllData[k].resourceOwner
					});
					this.getuserdetailsall(GetAllData[k].resourceOwner,k);
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
	
	getuserdetailsall(userId, index) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?dentalId="+userId;
		}
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			this.invitedata[index].userName = name;
			//alert(JSON.stringify(this.invitedata));
		}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
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
		
		//alert(JSON.stringify(this.jsonObjInviteEdit));
		
		this.dataService.putData(this.utility.apiData.userCaseInvites.ApiUrl, JSON.stringify(this.jsonObjInviteEdit), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  this.getInviteListing();
		  swal.fire("Case invitation removed successfully");
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
	
	getThread() {
		swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2500
		});
		
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userThreads.ApiUrl;
			let caseId = sessionStorage.getItem("caseId");
			url += "?caseId="+caseId;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.messagedata = JSON.parse(Response.toString());

					
					this.messageDataArray = Array();
					for(var i = 0; i < this.messagedata.length; i++)
					{
						let skVal = this.messagedata[i].sk;
						var skarray = skVal.split("#"); 
						//alert(skarray[0]);
						if(skarray[0] == 'MESSAGES')
						{
							this.messageDataArray.push({
								patientId: this.messagedata[i].patientId,
								caseId: this.messagedata[i].caseId,
								patientName: this.messagedata[i].patientName,
								dateUpdated: this.messagedata[i].dateUpdated,
								dateCreated: this.messagedata[i].dateCreated,
								messageId: '',
								messagetext: this.messagedata[i].message.text,
								messageimg: this.messagedata[i].message.links,
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
								caseId: this.messagedata[i].caseId,
								patientName: this.messagedata[i].patientName,
								dateUpdated: this.messagedata[i].dateUpdated,
								dateCreated: this.messagedata[i].dateCreated,
								messageId: '',
								messagetext: '',
								messageimg: '',
								messagecomments: ''
							});
						}
					}
					
					setTimeout(()=>{   
						this.messageAry = this.messageDataArray;
						this.messageAry.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1)
						//alert(JSON.stringify(this.messageAry));
					}, 2000);
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
			  return false;
			});
			
		}
	}
}