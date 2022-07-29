import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-case-add',
  templateUrl: './case-add.component.html',
  styleUrls: ['./case-add.component.css']
})
export class CaseAddComponent implements OnInit {
	@ViewChild(Cvfast) cvfastval!: Cvfast;
	id:any = "addNonMembers";
	tabContent(ids:any){
		this.id = ids;
	}
	keyword = 'name';
	public allpatient: any[] = []
	tabledata:any;
	tabledataAll:any;
	public patientImg: any;
	public module = 'patient';
	public Img = 'assets/images/avatar3.png';
	public resourceOwn = '';
	public patientName = '';
	public patientImage = '';
	public Pid = '';
	public caseType = true;
	public caseImage = false;
	checkPatient = sessionStorage.getItem("checkPatient");
	public jsonObj = {
	  resourceOwner: '',
	  patientId: '',
	  patientName: '',
	  image: '',
	  title: '',
	  caseStatus: true,
	  description: {},
	  caseType: Array()
	}
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
	btnState:boolean=true;
	casetypeArray = Array();
	
	actionMethod(event: MouseEvent){
		(event.target as HTMLButtonElement).disabled = true;
		if((event.target as HTMLButtonElement).disabled = true ){
		  this.btnState = false;
		}
		else{
		  this.btnState = true;
		}
	}
	
	constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router) { }
 
	ngOnInit(): void {
	this.getPatiantDetails();
	this.getAllPatiant();
	}
	getAllPatiant() {
		let user = this.usr.getUserDetails(false);
		if(user)
		{
		let url = this.utility.apiData.userPatients.ApiUrl;
		this.dataService.getallData(url, true).subscribe(Response => {
			if (Response)
			{
				this.tabledataAll = JSON.parse(Response.toString());
				this.allpatient = Array();
				for(var k = 0; k < this.tabledataAll.length; k++)
				{
					if(this.tabledataAll[k].isActive == true)
					{
						let name = this.tabledataAll[k].firstName+' '+this.tabledataAll[k].lastName;
						this.allpatient.push({
						  id: this.tabledataAll[k].patientId,
						  name: name,
						  patientimage: this.tabledataAll[k].image
						});
					}
				}
				//alert(JSON.stringify(this.allpatient));
			}
		}, (error) => {
		  swal.fire("Unable to fetch data, please try again");
		  return false;
		});
		}
	}
	onSubmit(form: NgForm) {
		if ((form.invalid) || (form.value.caseType == 0)) {
		  this.caseType = false;
		  if(form.value.caseType > 0)
		  {
		  this.caseType = true;
		  }
		  form.form.markAllAsTouched();
		  return;
		}
		this.onGetdateData(form.value);
	};
	selectEvent(item: any) {
		//alert(JSON.stringify(item));
		this.patientName = item.name;
		this.patientImage = item.patientimage;
		this.Pid = item.id;
		setTimeout(()=>{     
			if(item.patientimage)
			{
				this.setcvImage(item.patientimage);
			}
		}, 1000);
	// do something with selected item
	}

	onChangeSearch(search: string) {
	// fetch remote data from here
	// And reassign the 'data' which is binded to 'data' property.
	}

	onFocused(e: any) {
	// do something
	}
	onGetdateData(data: any)
	{
		this.jsonObj['resourceOwner'] = data.resourceOwner;
		this.jsonObj['patientId'] = data.patientId;
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['image'] = data.image;
		this.jsonObj['title'] = data.title;
		this.jsonObj['caseStatus'] = true;
		this.jsonObj['caseType'] = this.casetypeArray;
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
		this.jsonObj['description'] = this.cvfastval.returnCvfast();
		}
		//alert(JSON.stringify(this.jsonObj));
		this.dataService.postData(this.utility.apiData.userCases.ApiUrl, JSON.stringify(this.jsonObj), true)
			.subscribe(Response => {
			  //if (Response) Response = JSON.parse(Response.toString());
			  swal.fire('Cases added successfully');
			  this.router.navigate(['cases/case-list']);
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
	onChange(typeid: any) {
		const myCasetypeArray = this.casetypeArray;
		if(myCasetypeArray.includes(typeid))
		{
			let index = myCasetypeArray.indexOf(typeid);
			myCasetypeArray.splice(index,1);
			this.casetypeArray = myCasetypeArray;
		}
		else
		{
			myCasetypeArray.push(typeid);
			this.casetypeArray = myCasetypeArray;
		}
	}
	getPatiantDetails() {
		let user = this.usr.getUserDetails(false);
		this.resourceOwn = user.emailAddress;
		let url = this.utility.apiData.userPatients.ApiUrl;
		let patientId = sessionStorage.getItem("patientId");
		if(patientId != '')
		{
			url += "?patientId="+patientId;
			this.dataService.getallData(url, true)
			.subscribe(Response => {
				if (Response)
				{
					this.tabledata = JSON.parse(Response.toString());
					
					this.patientName = this.tabledata.firstName+' '+this.tabledata.lastName;
					this.patientImage = this.tabledata.image;
					this.Pid = this.tabledata.patientId;
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
	}
}
