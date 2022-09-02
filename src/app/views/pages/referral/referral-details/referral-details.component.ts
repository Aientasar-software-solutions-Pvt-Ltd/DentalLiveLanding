//@ts-nocheck
import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReferralGuideComponent } from '../referral-guide/referral-guide.component';
import { Location } from '@angular/common';
import * as $ from "jquery";
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Cvfast } from '../../../../cvfast/cvfast.component';


@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.css']
})
export class ReferralDetailsComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	isLoadingData = true;
	show = false;
	show1 = false;
	id:any = "tab1";
	shimmer = Array;
	tabContent(ids:any){
		this.id = ids;
	}
	showComment: any;
	replyToggle(index){
		this.setMessageRpValue = false;
		this.showComment =index;
	}
	@ViewChild(ReferralGuideComponent)
	orders: ReferralGuideComponent;
	
  dtOptions: DataTables.Settings = {};
  
  public module = 'patient';
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	public attachmentFiles: any[] = []
	tabledata:any;
	detailsdata:any;
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
	public jsonObjmsg = {
		patientId: '',
		caseId: '',
		patientName: '',
		message: {},
		comments: [{}],
		messageType: '0'
	}
	
	editedDate:any;
	public descriptionObj = {
	  links: Array(),
	  text: ''
	}
	minDate = new Date();
	public isvalidDate = false;
	cvfastMsgText: boolean = false;
	cvfastMsgLinks: boolean = false;
	setMessageValue: boolean = false;
	setMessageRpValue: boolean = false;
	public messageArray: any[] = []
	public messageDataArray: any[] = []
	public messageAry: any[] = []
	messagedata:any;
    referralId:any;
 constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private utilitydev: UtilityServicedev, private route: ActivatedRoute) {
	this.referralId = this.route.snapshot.paramMap.get('referralId');
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
	$('a[data-bs-toggle="tab"]').on('click', function(e:any){
		var target = $(e.target).attr("href"); // activated tab
		$($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
	});
	this.getReferralDetails();
	this.getCaseDetails();
  }
  
  
	getReferralDetails() {
		this.tabledata = '';
		/* swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		}); */
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userReferrals.ApiUrl;
		let referralId = this.referralId;
		if(referralId != '')
		{
			url += "?referralId="+referralId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					this.isLoadingData = false;
					this.tabledata = JSON.parse(Response.toString());
					this.setcvFast(this.tabledata.notes);
					this.toothData = this.tabledata.toothguide;
					this.cvfastText = true;
					this.descriptionObj.text = this.tabledata.notes.text;
					this.descriptionObj.links = this.tabledata.notes.links;
					//alert(JSON.stringify(this.tabledata));
					this.getMessage(this.tabledata.caseId);
				}
			}, (error) => {
					//alert(JSON.stringify(error));
					swal( 'Unable to fetch data, please try again');
			  return false;
			});
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
				this.editdata = this.casefilesArray;
			}
		}
	}
	
	getCaseDetails() {
		this.detailsdata = '';
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			/* swal("Processing...please wait...", {
			  buttons: [false, false],
			  closeOnClickOutside: false,
			}); */
			let url = this.utility.apiData.userCases.ApiUrl;
			
			let caseId = sessionStorage.getItem("caseId");
			
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					this.isLoadingData = false;
					this.detailsdata = JSON.parse(Response.toString());
					//alert(JSON.stringify(this.detailsdata));
				}
			}, (error) => {
			  swal( 'Unable to fetch data, please try again');
			  return false;
			});
		}
	}
	
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	ngAfterViewInit() {
		this.orders.setToothGuide(this.toothData)
	}
	
	
	onSubmitReferral(form: NgForm){
		if(form.value.startdate >= Date.parse(form.value.enddate))
		{
			this.isvalidDate =true;
			swal( 'Due date should be greater than to start date');
		}
		else
		{
			this.isvalidDate =false;
		}
		if ((form.invalid) || (this.isvalidDate == true)) {
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
		//this.jsonObj['title'] = data.title;
		//this.jsonObj['startdate'] = Date.parse(data.startdate);
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		//this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		
		this.jsonObj['notes'] = this.descriptionObj;
	
		
		//alert(JSON.stringify(this.jsonObj));
		
		this.dataService.putData(this.utility.apiData.userReferrals.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  this.getReferralDetails();
		  swal( 'Referral Due Date updated successfully');
		  //this.router.navigate(['/referral/referral-details']);
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
			let messageType = "4";
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
		this.jsonObjmsg['messageType'] = '4';
		this.jsonObjmsg['messageReferenceId'] = form.value.CmessageReferenceId;
		//alert(JSON.stringify(this.jsonObjmsg));
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Comments added successfully', 'referral/referral-list', 'put', '','comments');
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
		this.jsonObjmsg['messageType'] = '4';
		this.jsonObjmsg['messageReferenceId'] = form.value.messageReferenceId;
		//alert(JSON.stringify(this.jsonObjmsg));
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Message added successfully', 'referral/referral-list', 'post', '','message');
		this.getMessage(this.tabledata.caseId);
	};
}