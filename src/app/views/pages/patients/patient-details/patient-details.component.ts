//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  tabledata:any;
  casedata:any;
  public Img = 'assets/images/avatar3.png';
  public caseImage = false;
  public refrernceNo = '-';
  public mobileNo = '-';
  public policyNo = '-';
  public insurance = '-';
  public patientImg: any;
  public module = 'patient';
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router) { }

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
	this.getallpatiant();
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
	getallpatiant() {
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
		this.getallcase();
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
	
	getallcase() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
			let patientId = sessionStorage.getItem("patientId");
			let url = this.utility.apiData.userCases.ApiUrl;
			if(patientId != '')
			{
				url += "?patientId="+patientId;
			}
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.casedata = JSON.parse(Response.toString()).reverse();
					//alert(JSON.stringify(this.casedata));
				}
			}, (error) => {
			  swal.fire("Unable to fetch data, please try again");
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
		this.router.navigate(['cases/case-add']);
	}

	viewCase(caseId: any) {
		sessionStorage.setItem('caseId', caseId);
		this.router.navigate(['master']);
	}
}
