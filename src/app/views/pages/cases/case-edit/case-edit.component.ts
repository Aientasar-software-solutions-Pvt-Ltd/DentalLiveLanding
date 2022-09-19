//@ts-nocheck
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import "@lottiefiles/lottie-player";
import {encode} from 'html-entities';
import {decode} from 'html-entities';

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.css']
})
export class CaseEditComponent implements OnInit {
  @ViewChild(Cvfast) cvfastval!: Cvfast;
	sending: boolean;
	public patientImg: any;
	public tabledata: any;
	public patientdata: any;
	public module = 'patient';
	public caseType = true;
	public Img = 'assets/images/users.png';
	public resourceOwn = '';
	public patientName = '';
	public patientImage = '';
	public Pid = '';
	public caseType = true;
	public caseId: any;
	public caseImage = false;
	public caseTitle:any;
	
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
		this.jsonObj['title'] = encode(data.title);
		this.jsonObj['patientId'] = data.patientId;
		this.jsonObj['patientName'] = data.patientName;
		this.jsonObj['caseId'] = this.caseId;
		this.jsonObj['caseStatus'] = true;
		this.jsonObj['caseType'] = this.casetypeArray;
		if((this.cvfastval.returnCvfast().text != '') || (this.cvfastval.returnCvfast().links.length > 0))
		{
		this.jsonObj['description'] = this.cvfastval.returnCvfast();
		}
		let returnUrl = 'cases-view/caseDetails/'+this.getcaseId;
		this.cvfastval.processFiles(this.utility.apiData.userCases.ApiUrl, this.jsonObj, true, 'Case updated successfully', returnUrl, 'put','','description',0,'Case title already exists.').then(
		(value) => {
		this.sending = false;
		},
		(error) => {
		this.sending = false;
		});
		
	}
	onSubmit(form: NgForm) {
		if (form.invalid || (form.value.caseType == 0)) {
		  swal("Enter values properly");
		  this.caseType = false;
		  if(form.value.caseType > 0)
		  {
		  this.caseType = true;
		  }
		  form.form.markAllAsTouched();
		  return;
		}
		this.sending = true;
		this.onGetdateData(form.value);
	};
  getCasedetails() {
	this.sending = true;
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
				this.sending = false;
				this.tabledata = JSON.parse(Response.toString());
				//this.setcvFast(this.tabledata.description);
				this.caseTitle = decode(this.tabledata.title);
				this.setCaseType(this.tabledata.caseType);
				this.getallPatient(this.tabledata.patientId);
				setTimeout(()=>{     
					this.setcvFast();
				}, 1000);
				//let caseType = this.tabledata.caseType;
				
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
