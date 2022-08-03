import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WorkOrderGuideComponent } from '../work-order-guide/work-order-guide.component';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-work-order-details',
  templateUrl: './work-order-details.component.html',
  styleUrls: ['./work-order-details.component.css']
})
export class WorkOrderDetailsComponent implements OnInit {
	show = false;
	show1 = false;
	toothData:any;
	id:any = "tab1";
	tabContent(ids:any){
		this.id = ids;
	}
	@ViewChild(WorkOrderGuideComponent)
	orders: WorkOrderGuideComponent;
	public jsonObj = {
	  workorderId: '',
	  caseId: '',
	  patientId: '',
	  title: '',
	  notes: {},
	  startdate: 0,
	  enddate: 0,
	  toothguide: {},
	  milestoneId: '',
	  presentStatus: 0,
	}
	dtOptions: DataTables.Settings = {};
	public module = 'patient';
	cvfastText: boolean = false;
	cvfastLinks: boolean = false;
	public attachmentFiles: any[] = []
	public casefilesArray: any[] = []
	
	constructor(private location: Location, private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private utilitydev: UtilityServicedev) { }
  
	back(): void {
		this.location.back()
	}
	tabledata:any;
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
		this.getallworkorder();
	}
	
	getallworkorder() {
		
		let user = this.usr.getUserDetails(false);
		let url = this.utility.apiData.userWorkOrders.ApiUrl;
		let workorderId = sessionStorage.getItem("workorderId");
		if(workorderId != '')
		{
			url += "?workorderId="+workorderId;
		}
		if(user)
		{
			this.dataService.getallData(url, true).subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					this.toothData = this.tabledata.toothguide;
					this.setcvFast(this.tabledata.notes);
					this.cvfastText = true;
					//alert(JSON.stringify(this.tabledata));
					//alert(JSON.stringify(this.tabledata.title));
				}
			}, (error) => {
					alert(JSON.stringify(error));
			  swal.fire("Unable to fetch data, please try again");
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
				this.tabledata = this.casefilesArray;
			}
		}
	}
	searchText(event: any) {
		var v = event.target.value;  // getting search input value
		$('#dataTables').DataTable().search(v).draw();
	}
	ngAfterViewInit() {
		this.orders.setToothGuide(this.toothData)
	}

}
