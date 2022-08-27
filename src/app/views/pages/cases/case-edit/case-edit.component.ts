//@ts-nocheck
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.css']
})
export class CaseEditComponent implements OnInit {
  @ViewChild(Cvfast) cvfastval!: Cvfast;
	public patientImg: any;
	public tabledata: any;
	public patientdata: any;
	public module = 'patient';
	public Img = 'assets/images/avatar3.png';
	public resourceOwn = '';
	public patientName = '';
	public patientImage = '';
	public Pid = '';
	public caseType = true;
	public caseId: any;
	public caseImage = false;
	
	public jsonObj = {
	  patientId: '',
	  patientName: '',
	  caseId: '',
	  image: '',
	  title: '',
	  caseStatus: true,
	  description: {},
	  caseType: Array()
	}
	casetype = [ 
		{name :"General Dentistry", id: 1, isChecked: false},
		{name :"Endodontics", id: 2, isChecked: false},
		{name :"Dental Pediatrics", id: 3, isChecked: false},
		{name :"Prosthodontics", id: 4, isChecked: false},
		{name :"Oral Surgery", id: 5, isChecked: false},
		{name :"Lab", id: 6, isChecked: false},
		{name :"Periodontics", id: 7, isChecked: false},
		{name :"Oral Pathology", id: 8, isChecked: false},
		{name :"Dentures", id: 9, isChecked: false},
		{name :"Orthodontics", id: 10, isChecked: false},
		{name :"Oral Radiology", id: 11, isChecked: false},
		{name :"Hygiene", id: 12, isChecked: false}
	  ];
	casetypeArray = Array();
  getcaseId: string;
  constructor(private dataService: ApiDataService, private utility: UtilityService, private usr: AccdetailsService, private router: Router, private route: ActivatedRoute) { 
  this.getcaseId = this.route.snapshot.paramMap.get('caseId');
  }

  ngOnInit(): void {
	  this.getCasedetails();
  }
  onGetdateData(data: any)
	{
		this.jsonObj['image'] = data.image;
		this.jsonObj['title'] = data.title;
		this.jsonObj['patientId'] = data.patientId;
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['caseId'] = this.caseId;
		this.jsonObj['caseStatus'] = true;
		this.jsonObj['caseType'] = this.casetypeArray;
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
		this.jsonObj['description'] = this.cvfastval.returnCvfast();
		}
		let returnUrl = 'master/master-list/'+this.getcaseId+'/caseDetails';
		this.cvfastval.processFiles(this.utility.apiData.userCases.ApiUrl, this.jsonObj, true, 'Case updated successfully', returnUrl, 'put','','description',0);
		//alert(JSON.stringify(this.jsonObj));
		
	}
	onSubmit(form: NgForm) {
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		this.onGetdateData(form.value);
	};
  getCasedetails() {
	var sweet_loader = '<div class="sweet_loader"><img style="width:50px;" src="https://www.boasnotas.com/img/loading2.gif"/></div>';
	swal.fire({
		html: sweet_loader,
		showConfirmButton: false,
		allowOutsideClick: false,     
		timer: 2200
	});
	this.tabledata = '';
	let url = this.utility.apiData.userCases.ApiUrl;
	this.caseId = this.getcaseId;
	if(this.caseId != '')
	{
		url += "?caseId="+this.caseId;
	}
	this.dataService.getallData(url, true)
	.subscribe(Response => {
		if (Response)
		{
			this.tabledata = JSON.parse(Response.toString());
			//this.setcvFast(this.tabledata.description);
			this.setCaseType(this.tabledata.caseType);
			this.getallPatient(this.tabledata.patientId);
			setTimeout(()=>{     
				this.setcvFast();
			}, 1000);
			//let caseType = this.tabledata.caseType;
			
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
	setcvFast()
	{
		this.cvfastval.setCvfast(this.tabledata.description);
	}
	setCaseType(obj: any)
	{
		if(obj.length > 0)
		{
			for(var i = 0; i < obj.length; i++)
			{
				 this.getDimensionsByFilter(obj[i]);
			}
		}
			//alert(JSON.stringify(this.casetype));
	}
	getDimensionsByFilter(id: any){
		this.onChange(id);
		for(var i = 0; i < this.casetype.length; i++)
		{
			if(this.casetype[i].id == id)
			{
				 this.casetype[i].isChecked = true;
			}
		}
	  //return this.casetype.filter(x => x.id === id);
	}
	getallPatient(patientId: any) {
		let url = this.utility.apiData.userPatients.ApiUrl;
		if(patientId != '')
		{
			url += "?patientId="+patientId;
		}
		this.dataService.getallData(url, true)
		.subscribe(Response => {
			if (Response)
			{
				this.patientdata = JSON.parse(Response.toString());
				this.patientName = this.patientdata.firstName+' '+this.patientdata.lastName;
				this.patientImage = this.patientdata.image;
				this.Pid = this.patientdata.patientId;
				
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
}
