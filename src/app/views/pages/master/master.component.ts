//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';	
import { NgForm } from '@angular/forms';								
import { CalendarOptions } from '@fullcalendar/angular'; 
import swal from 'sweetalert2';
import { ApiDataService } from '../users/api-data.service';
import { UtilityService } from '../users/utility.service';
import { UtilityServicedev } from '../../../utilitydev.service';
import { AccdetailsService } from '../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
	calendarOptions: CalendarOptions = {}
	
	show = false;
	show1 = false;
	show2 = false;
	show3 = false;
	show4 = false;
	show5 = false;
	show6 = false;
	show7 = false;
	show8 = false;
 
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
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;

	onCompletedArchiveChanged(value:boolean){
		this.saveCompletedArchive = value;
	}
	dtOptions: DataTables.Settings = {};
	tabledata:any;
	milestonedata:any;
	workordersdata:any;
	patientdata:any;
	public patientImg: any;
	public module = 'patient';
	public CaseTypeVal = '';
	public casefilesArray: any[] = []
	public eventsData: any[] = []
	public attachmentFiles: any[] = []
	public attachmentUploadFiles: any[] = []
	public UploadFiles: any[] = []
	public filesdata: any;
	public filesdataArray: any;
	public uploaddata: any;
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
	this.getCaseDetails();
	this.getFilesListing();
	this.getallmilestone();
	this.getallworkorder();
	//Set current tab
	let masterTab = sessionStorage.getItem("masterTab");
	(masterTab) ? this.tab = masterTab : this.tab = 'tab1';
	}
  
	getallworkorder() {
		let user = this.usr.getUserDetails(false);
		if(user)
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
}
