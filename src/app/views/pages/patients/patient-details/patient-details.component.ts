//@ts-nocheck
import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';	
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
	isLoadingData = true;
  dtOptions: DataTables.Settings = {};
  tabledata:any;
  casedata:any;
  shimmer = Array;
  public Img = 'assets/images/users.png';
  public caseImage = false;
  public refrernceNo = '-';
  public mobileNo = '-';
  public policyNo = '-';
  public insurance = '-';
  public patientImg: any;
  public module = 'patient';
  public indexRow = 0;
  paramPatientId: any;
  public attachmentFiles: any[] = []
  public allMember: any;
  invitedatas:any;
  userDeatils:any;
  cvfastText: boolean = false;
  cvfastLinks: boolean = false;
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private route: ActivatedRoute) {
	this.paramPatientId = this.route.snapshot.paramMap.get('patientId');
  }

  ngOnInit(): void {
		this.userDeatils = this.usr.getUserDetails(false);
		this.getallpatiant();
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
				setTimeout(()=>{     
					this.isLoadingData = false;
				}, 1000);
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
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
	}
	getallpatiant() {
		let user = this.usr.getUserDetails(false);
		this.tabledata = '';
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
				//swal.close();
				this.tabledata = JSON.parse(Response.toString());
				if((this.tabledata.resourceOwner == user.emailAddress))
				{
					this.getallcase();
				}
				else
				{
					this.getAllMembers();
				}
				if(this.tabledata.refId)
				{
				this.refrernceNo = this.tabledata.refId;
				}
				if(this.tabledata.phone)
				{
					this.mobileNo = this.tabledata.phone;
				}
				if(this.tabledata.insurance.policyno)
				{
					this.policyNo = this.tabledata.insurance.policyno;
				}
				if(this.tabledata.insurance.carrier)
				{
					this.insurance = this.tabledata.insurance.carrier;
				}
				setTimeout(()=>{     
					if(this.tabledata.image)
					{
						this.setcvImage(this.tabledata.image);
					}
					else{
						this.isLoadingData = false;
					}
				}, 1000);
				this.setcvFast(this.tabledata.notes);
				this.cvfastText = true;
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
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
	}
	getAllMembers() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCaseInvites.ApiUrl;
			
			url += "?invitedUserMail="+user.emailAddress;
			url += "&presentStatus=1";
			let patientId = this.paramPatientId;
			if(patientId != '')
			{
				url += "&patientId="+patientId;
			}
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.allMember = JSON.parse(Response.toString());
					this.allMember.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					this.getColleaguesCase();
				}
			}, error => {
				if (error.status === 404)
				swal('No case found');
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
	
	getColleaguesCase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			this.casedata = Array();	
			for(var k=0; k < this.allMember.length; k++)
			{
				let url1 = this.utility.apiData.userCases.ApiUrl;
				url1 += "?caseId="+this.allMember[k].caseId;
				this.dataService.getallData(url1, true).subscribe(Response => {
					if (Response)
					{
						let AllDate = JSON.parse(Response.toString());
						this.casedata.push({
						  patientName: AllDate.patientName,
						  title: AllDate.title,
						  caseStatus: AllDate.caseStatus,
						  dateCreated: AllDate.dateCreated,
						  memberName: '',
						  patientId: AllDate.patientId,
						  caseId: AllDate.caseId
						});
						this.getCaseMemberList(AllDate.caseId,(k-1),2);
					}
				}, (error) => {
					if (error.status === 404)
					swal('No case found');
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
	setcvFast(obj: any)
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
					swal('Due to dependency data unable to complete operation');
					else if (error.status === 500)
					swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
					else
					swal('Oops something went wrong, please try again');
				});
			}
		}
	}
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let url = this.utility.apiData.userCases.ApiUrl;
			let patientId = this.paramPatientId;
			if(patientId != '')
			{
				url += "?patientId="+patientId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let AllDate = JSON.parse(Response.toString());
					AllDate.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					let casedataResult = AllDate.slice(0, 5);
					
					this.casedata = Array();
					for(var k = 0; k < casedataResult.length; k++)
					{
						this.casedata.push({
						  id: k,
						  patientName: casedataResult[k].patientName,
						  title: casedataResult[k].title,
						  caseStatus: casedataResult[k].caseStatus,
						  dateCreated: casedataResult[k].dateCreated,
						  memberName: '',
						  patientId: casedataResult[k].patientId,
						  caseId: casedataResult[k].caseId
						});
						this.getCaseMemberList(casedataResult[k].caseId,k,1);
					}
				
				}
			}, (error) => {
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
				swal('Due to dependency data unable to complete operation');
				else if (error.status === 500)
				swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
				else
				swal('Oops something went wrong, please try again');
			  return false;
			});
		}
	}
	getCaseMemberList(caseId, index, type) {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
		if(caseId != '')
		{
			url += "?caseId="+caseId;
		}
		url += "&presentStatus=1";
		if(type == 1)
		{
		url += "&resourceOwner="+user.emailAddress;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				let GetAllData = JSON.parse(Response.toString());
				GetAllData.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
				this.invitedatas = Array();
				this.indexRow = 0;
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedatas.push({
					  id: this.indexRow,
					  userName: ''
					});
					this.getuserdetailsall(GetAllData[k].invitedUserId,this.indexRow,index);
					this.indexRow++;
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
			swal('Due to dependency data unable to complete operation');
			else if (error.status === 500)
			swal('The server encountered an unexpected condition that prevented it from fulfilling the request');
			else
			swal('Oops something went wrong, please try again');
		});
	}
	
	getuserdetailsall(userId, index, Row) {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userColleague.ApiUrl;
		if(userId != '')
		{
			url += "?dentalId="+userId;
		}
		let GetArray = this.invitedatas;
		this.dataService.getallData(url, true).subscribe(Response => {
		if (Response)
		{
			let userData = JSON.parse(Response.toString());
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			GetArray[index].userName = name;
			if((index+1) == GetArray.length)
			{
				this.casedata[Row].memberName = GetArray;
			}
		}
		}, (error) => {
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
			swal('Due to dependency data unable to complete operation');
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
	addcases() {
		sessionStorage.setItem('checkPatient', "1");
		sessionStorage.setItem('patientId', this.paramPatientId);
		this.router.navigate(['cases/case-add']);
	}

	viewCase(caseId: any, patientId: any) {
		this.router.navigate(['master/master-list/'+caseId+'/caseDetails']);
	}
	viewAllCase(patientId: any) {
		//sessionStorage.setItem('patientId', patientId);
		this.router.navigate(['patients/patient-case-list/'+patientId]);
	}
	@ViewChild('videoPlayer') videoplayer: ElementRef;

	video() {
		this.videoplayer?.nativeElement.play();
	}
}
