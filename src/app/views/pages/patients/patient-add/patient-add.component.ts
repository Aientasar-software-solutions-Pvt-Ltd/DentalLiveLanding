import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import { Router } from '@angular/router';
import {encode} from 'html-entities';
import "@lottiefiles/lottie-player";

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css']
})  
      
export class PatientAddComponent implements OnInit {
	sending = false;
	@ViewChild(Cvfast) cv!: Cvfast;
	saveActiveInactive: boolean = true;
	public patiantStatus = true;
	public isRequired: boolean;
	onActiveInactiveChanged(value:boolean){
		this.saveActiveInactive = value;
		this.patiantStatus = value;
	}
	maxDate = new Date();
	public medicationsArray: any[] = []
	public medications: any[] = [{
		id: 1,
		medication: '',
		dosage: '',
		duration: '',
		notes: '',
		isRequired: false,
	},{
		id: 2,
		medication: '',
		dosage: '',
		duration: '',
		notes: '',
		isRequired: false,
	},{
		id: 3,
		medication: '',
		dosage: '',
		duration: '',
		notes: '',
		isRequired: false,
	}];
	public jsonObj = {
	  firstName: '',
	  lastName: '',
	  email: '',
	  residingState: '',
	  refId: '',
	  image: '',
	  phone: '',
	  city: '',
	  isActive: false,
	  dob: 0,
	  address: {},
	  notes: {},
	  insurance: {},
	  medication: Array(),
	  gender: 0
	}
	public objAddress = {
	  street: ''
	}
	public objNote = {
	  note: ''
	}
	public inProcess = false;
	public PatientImg: any;
	public Insurance = '';
	public Medication = '';
	public objInsurance: any;
	public objMedication: any;
	public module = 'patient';
	public attachmentFiles: any[] = []
	public objMedicationLength: any[] = [{
		id: 1
	},{
		id: 2
	},{
		id: 3
	}];
  constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private UtilityDev: UtilityServicedev) { }

  ngOnInit(): void {
  }
  
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  onSubmitInsurance(form: NgForm) {
	  const json: JSON = form.value;
	  if((form.value.carrier != '') || (form.value.employer != '') || (form.value.policyno != '') || (form.value.group != '') || (form.value.policyholder != '') || (form.value.policydate != '') || (form.value.noteinc != ''))
	  {
		this.objInsurance = JSON.stringify(json);
		this.Insurance = "1";
	  }
	  else
	  {
		this.Insurance = "";
	  }
  }
  onSubmitMedication(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
	this.Medication = "1";
	this.medicationsArray = Array();
	for(var i = 0; i < this.objMedicationLength.length; i++)
	{
		const medication = "medication_"+this.objMedicationLength[i].id;
		const dosage = "dosage_"+this.objMedicationLength[i].id;
		const duration = "duration_"+this.objMedicationLength[i].id;
		const notes = "notes_"+this.objMedicationLength[i].id;
		this.medicationsArray.push({
		  medication: form.value[medication],
		  dosage: form.value[dosage],
		  duration: form.value[duration],
		  notes: form.value[notes]
		});
	}
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
      let allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel'];
     if (!allowedtypes.some(type => event.target.files[0]['type'].includes(type))) {
	  swal("File Extenion Not Allowed");
	  return;
	} else {
	  this.attachmentFiles = Array();
	  this.attachmentFiles.push({ name: this.getUniqueName(event.target.files[0]['name']), binaryData: event.target.files[0] });
	}
    }
  }
  onGetdateData(data: any,cvfast: any)
  {	
	let user = this.usr.getUserDetails(false);
	this.jsonObj['resourceOwner'] = user.emailAddress;
	this.jsonObj['firstName'] = encode(data.firstName);
	this.jsonObj['lastName'] = encode(data.lastName);
	this.jsonObj['dob'] = Date.parse(data.dob);
	this.jsonObj['email'] = data.email;
	this.jsonObj['residingState'] = encode(data.residingState);
	this.jsonObj['isActive'] = this.patiantStatus;
	if(data.refId)
	{
	this.jsonObj['refId'] = encode(data.refId);
	}
	if(data.phone)
	{
	this.jsonObj['phone'] = data.phone;
	}
	if(data.city)
	{
	this.jsonObj['city'] = encode(data.city);
	}
	if(data.address)
	{
	this.objAddress['street'] = encode(data.address);
	this.jsonObj['address'] = this.objAddress;
	}
	if(data.gender)
	{
	this.jsonObj['gender'] = parseInt(data.gender);
	}
	if(data.insurance)
	{
	this.jsonObj['insurance'] = JSON.parse(this.objInsurance);
	}
	if(data.medication)
	{
	this.jsonObj['medication'] = this.medicationsArray;
	}
	if(data.image)
	{
	this.jsonObj['image'] = this.PatientImg;
	}
	cvfast.processFiles(this.utility.apiData.userPatients.ApiUrl, this.jsonObj, true, 'Patient added successfully', 'patients/patients-list', 'post', '','notes','','Patient name already exists.').then(
	(value) => {
	this.sending = false;
	},
	(error) => {
	this.sending = false;
	});
  }
  onSubmit(form: NgForm) {
    if (form.invalid || (form.value.dob == 0)) {
	  swal("Please enter values for the mandatory fields");
      form.form.markAllAsTouched();
      return;
    }
	this.sending = true;
	if(form.value.image)
	{
		let GetForm = form.value;
		let cvfast = this.cv;
		let requests = this.attachmentFiles.map((object) => {
		  return this.UtilityDev.uploadBinaryData(object["name"], object["binaryData"], this.module);
		});
		Promise.all(requests)
		  .then((values) => {
			this.attachmentFiles = [];
			this.PatientImg = values[0];
			this.onGetdateData(GetForm,cvfast);
		  })
		  .catch((error) => {
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
	else{
		this.onGetdateData(form.value,this.cv);
	}
  };
  addMedication() {
    this.objMedicationLength.push({
      id: this.medications.length + 1
    });
    this.medications.push({
      id: this.medications.length + 1,
      medication: '',
      dosage: '',
      duration: '',
      notes: '',
	  isRequired: false,
    });
  }

  removeMedication(i: number): void {
	this.objMedicationLength.splice(i, 1);
	if (this.medications.length > 1) this.medications.splice(i, 1);
  }
  
  addMedicationValidation(i: number, str: string, event: any): void {
	  
	if(this.medications[i].medication != '' || this.medications[i].dosage != '' || this.medications[i].duration != '' || this.medications[i].notes != ''){
		this.medications[i].isRequired=true;
	}
	else{
		this.medications[i].isRequired=false;
	}
	
	if(str == 'medication')
	{
	this.medications[i].medication=encode(event.target.value);
	}
	if(str == 'dosage')
	{
	this.medications[i].dosage=encode(event.target.value);
	}
	if(str == 'duration')
	{
	this.medications[i].duration=encode(event.target.value);
	}
	if(str == 'notes')
	{
	this.medications[i].notes=encode(event.target.value);
	}
  }
  
  logValue() {
    console.log(this.medications);
  }

}