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
	@ViewChild(ReferralGuideComponent)
	orders: ReferralGuideComponent;
	toothData: any;
	tabContent(ids:any){
		this.id = ids;
		if(this.id == 'tab1')
		{
			setTimeout(()=>{    
				if(this.toothData)
				{
					this.orders.setToothGuide(this.toothData);
				}
			}, 1000);
		}
		sessionStorage.setItem("referralTabActive", ids);
	}
	showComment: any;
	replyToggle(index){
		this.setMessageRpValue = false;
		this.showComment =index;
	}
	
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
	  toothguide: {},
	  enddate: 0,
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
	referaltitle:any;
	public Img = 'assets/images/users.png';
	public caseImage = false;
	patientImg: any;
	parmCaseId:any;
	casesName:any;
	patientName:any;
	referalmembers:any;
	public referalmembersName = '';
	referalmilestoneId:any;
	userDetails:any;
	
 constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private utilitydev: UtilityServicedev, private route: ActivatedRoute) {
	this.referralId = this.route.snapshot.paramMap.get('referralId');
 }
  
  back(): void {
    this.location.back()
  }
  
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
	$('a[data-bs-toggle="tab"]').on('click', function(e:any){
		var target = $(e.target).attr("href"); // activated tab
		$($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
	});
	this.getReferralDetails().then(
	(value) => {
	//Set current tab
	let tabActive = sessionStorage.getItem("referralTabActive");
	(tabActive) ? this.id = tabActive : this.id = 'tab1';
	},
	(error) => {
	//Set current tab
	let tabActive = sessionStorage.getItem("tabActive");
	(tabActive) ? this.id = tabActive : this.id = 'tab1';
	});
  }
  
  
	getReferralDetails() {
		return new Promise((Resolve, myReject) => {
			this.tabledata = '';
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
						this.tabledata = JSON.parse(Response.toString());
						this.toothData = this.tabledata.toothguide;
						this.getCaseDetails(this.tabledata.caseId);
						this.referaltitle = this.tabledata.title;
						this.referalmembers = this.tabledata.members;
						this.referalmilestoneId = this.tabledata.milestoneId;
						this.descriptionObj.text = this.tabledata.notes.text;
						if((this.tabledata.notes.text != '') && (this.tabledata.notes.text != 'undefined') && (this.tabledata.notes.text != undefined))
						{
						this.cvfastText = true;
						}
						this.descriptionObj.links = this.tabledata.notes.links;
						//alert(JSON.stringify(this.tabledata));
						this.getuserdetailsall(this.referalmembers);
						this.getMessage(this.tabledata.caseId);
						this.setcvFast(this.tabledata.notes);
						if(this.id == 'tab1')
						{
						this.isLoadingData = false;
						this.orders.setToothGuide(this.toothData);
						}
						Resolve(true);
					}
				}, (error) => {
					Resolve(true);
					if (error.status === 404)
					swal('No referral found');
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
		});
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
				  swal( 'Unable to fetch data, please try again');
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
							swal('No referral found');
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
							swal('No referral found');
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
					this.editdata = this.casefilesArray;
				}
			}
		}
	}
	
	getCaseDetails(caseId) {
		this.detailsdata = '';
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
						
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.detailsdata = JSON.parse(Response.toString());
				}
			}, (error) => {
				if (error.status === 404)
				swal('No referral found');
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
	
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
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
		this.jsonObj['caseId'] = data.caseId;
		this.jsonObj['patientId'] = data.patientId;
		this.jsonObj['title'] = this.referaltitle;
		this.jsonObj['enddate'] = Date.parse(data.enddate);
		this.jsonObj['presentStatus'] = Number(data.presentStatus);
		this.jsonObj['toothguide'] = this.orders.getToothGuide();
		this.jsonObj['members'] = this.referalmembers;
		
		this.dataService.putData(this.utility.apiData.userReferrals.ApiUrl, JSON.stringify(this.jsonObj), true)
		.subscribe(Response => {
		  if (Response) Response = JSON.parse(Response.toString());
		  this.getReferralDetails();
		  swal( 'Referral Due Date updated successfully');
		}, error => {
			if (error.status === 404)
			swal('No referral found');
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
			let messageType = "4";
			if(caseId != '')
			{
				url += "?caseId="+caseId;
			}
			url += "&messageType="+Number(messageType);
			url += "&messageReferenceId="+this.referralId;
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.messagedata = JSON.parse(Response.toString()).reverse();
					this.messagedata.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.messageDataArray = Array();
					let checkArray = 0;
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
								messageimg: [],
								messagedate: this.messagedata[i].dateCreated,
								messagecomment: this.messagedata[i].comments,
								messageReferenceId: this.messagedata[i].messageReferenceId,
								messagecomments: this.messagedata[i].comments
							});
							this.setcvFastComment(this.messagedata[i].comments,i);
							this.setcvFastMsg(this.messagedata[i].message,i);
							this.cvfastMsgText = true;
							checkArray++;
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
							checkArray++;
						}  
					}
					if(checkArray == this.messagedata.length)
					{
					this.messageAry = this.messageDataArray;
					this.isLoadingData = false;
					}
				}
			}, (error) => {
				if (error.status === 404)
				swal('No referral found');
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
								if (error.status === 404)
								swal('No referral found');
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
					//alert(JSON.stringify(NewCommentArray));
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
	setcvFastMsg(obj: any, index: any)
	{
		let MessageDetails = Array();
		if(JSON.stringify(obj.links).length > 2)
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
							if(obj.links.length == i)
							{
								this.messageDataArray[index].messageimg = MessageDetails; 
							}						
						}
					}, error => {
						if (error.status === 404)
						swal('No referral found');
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
		this.jsonObjmsg['messageType'] = '4';
		this.jsonObjmsg['messageReferenceId'] = form.value.CmessageReferenceId;
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Comments added successfully', '', 'put', '','comments',1,'Comments already exists.').then(
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
		this.jsonObjmsg['messageType'] = '4';
		this.jsonObjmsg['messageReferenceId'] = form.value.messageReferenceId;
		
		this.cvfastval.processFiles(this.utility.apiData.userMessage.ApiUrl, this.jsonObjmsg, true, 'Message added successfully', '', 'post', '','message',1,'Message already exists.').then(
		(value) => {
		swal.close();
		this.sending = false;
		},
		(error) => {
		swal.close();
		this.sending = false;
		});
		this.getMessage(this.tabledata.caseId);
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
}