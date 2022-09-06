import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-case-list',
  templateUrl: './patient-case-list.component.html',
  styleUrls: ['./patient-case-list.component.css']
})
export class PatientCaseListComponent implements OnInit {

  casedata:any;
  dtOptions: DataTables.Settings = {};
  paramPatientId: any;
  invitedatas:any;
  public indexRow = 0;
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private route: ActivatedRoute) {
	this.paramPatientId = this.route.snapshot.paramMap.get('patientId');
  }

  ngOnInit(): void {
	this.getallcase();
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
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	
	viewCase(caseId: any, patientId: any) {
		//localStorage.setItem('caseId', caseId);
		//this.router.navigate(['master/master-list']);
		this.router.navigate(['master/master-list/'+caseId+'/caseDetails']);
	}
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{

			swal.fire({
				title: 'Loading....',
				showConfirmButton: false,
				timer: 3000
			});
			let url = this.utility.apiData.userCases.ApiUrl;
			let patientId = this.paramPatientId;
			if(patientId != '')
			{
				url += "?patientId="+patientId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					let casedataResult = JSON.parse(Response.toString());
					//let caseDate = AllDate.sort((first, second) => 0 - (first.dateCreated > second.dateCreated ? -1 : 1));
					casedataResult.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? -1 : 1);
					
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
			  swal.fire("Unable to fetch data, please try again");
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
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
}
