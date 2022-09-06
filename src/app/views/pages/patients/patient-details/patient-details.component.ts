//@ts-nocheck
import { Component, OnInit } from '@angular/core';
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
  public Img = 'assets/images/avatar3.png';
  public caseImage = false;
  public refrernceNo = '-';
  public mobileNo = '-';
  public policyNo = '-';
  public insurance = '-';
  public patientImg: any;
  public module = 'patient';
  public indexRow = 0;
  paramPatientId: any;
  invitedatas:any;
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private route: ActivatedRoute) {
	this.paramPatientId = this.route.snapshot.paramMap.get('patientId');
  }

  ngOnInit(): void {
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
	getallpatiant() {
		this.tabledata = '';
		/* swal("Processing...please wait...", {
		  buttons: [false, false],
		  closeOnClickOutside: false,
		}); */
		this.getallcase();
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
				}, 1000);
				this.isLoadingData = false;
				//alert(JSON.stringify(this.tabledata));
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
	
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		
			/* swal("Processing...please wait...", {
			  buttons: [false, false],
			  closeOnClickOutside: false,
			}); */
			let url = this.utility.apiData.userCases.ApiUrl;
			let patientId = this.paramPatientId;
			if(patientId != '')
			{
				url += "?patientId="+patientId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					//swal.close();
					let AllDate = JSON.parse(Response.toString());
					//let caseDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
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
						this.getCaseMemberList(casedataResult[k].caseId,k);
					}
					//alert(JSON.stringify(this.casedata));
				
				}
			}, (error) => {
			  swal('Unable to fetch data, please try again');
			  return false;
			});
		}
	}
	getCaseMemberList(caseId, index) {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userCaseInvites.ApiUrl;
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
				//alert(JSON.stringify(GetAllData));
				this.invitedatas = Array();
				this.indexRow = 0;
				for(var k = 0; k < GetAllData.length; k++)
				{
					this.invitedatas.push({
					  id: this.indexRow,
					  userName: ''
					});
					//alert(GetAllData[k].invitedUserId);
					this.getuserdetailsall(GetAllData[k].invitedUserId,this.indexRow,index);
					this.indexRow++;
				} 
				//alert(JSON.stringify(this.invitedata));
				//alert(JSON.stringify(this.tabledata));
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
			//alert(JSON.stringify(GetArray));
			let name = userData[0].accountfirstName+' '+userData[0].accountlastName;
			GetArray[index].userName = name;
			if((index+1) == GetArray.length)
			{
				this.casedata[Row].memberName = GetArray;
				//alert(JSON.stringify(this.casedata[Row].memberName));
			}
		}
		}, (error) => {
			swal('Unable to fetch data, please try again');
		  return false;
		});
		}
	}
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	addcases() {
		localStorage.setItem('checkPatient', "1");
		localStorage.setItem('patientId', this.paramPatientId);
		this.router.navigate(['cases/case-add']);
	}

	viewCase(caseId: any, patientId: any) {
		//localStorage.setItem('caseId', caseId);
		//this.router.navigate(['master/master-list']);
		this.router.navigate(['master/master-list/'+caseId+'/caseDetails']);
	}
	viewAllCase(patientId: any) {
		//localStorage.setItem('patientId', patientId);
		this.router.navigate(['patients/patient-case-list/'+patientId]);
	}
}
