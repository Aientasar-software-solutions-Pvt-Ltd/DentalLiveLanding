//@ts-nocheck
import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiDataService } from '../../users/api-data.service';
import { UtilityService } from '../../users/utility.service';
import { UtilityServicedev } from '../../../../utilitydev.service';
import { AccdetailsService } from '../../accdetails.service';
import { Cvfast } from '../../../../cvfast/cvfast.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css'],
})
export class PatientEditComponent implements OnInit {
@ViewChild(Cvfast) cv!: Cvfast;
saveActiveInactive: boolean = false;

public patiantStatus = false;
onActiveInactiveChanged(value:boolean){
	this.saveActiveInactive = value;
	this.patiantStatus = value;
}
    public tabledata:any;
  
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
	  gender: 0,
	  patientId: 0
	}
	public objAddress = {
	  street: ''
	}
	public objNote = {
	  note: ''
	}
	maxDate = new Date();
	public module = 'patient';
	public patientImg: any;
	public patientImgdata: any;
	public patientImage = '';
	public objInsuranceview: any;
	public objInsurance: any;
	public medicationsArray1: any[] = []
	//public medicationsArray: any[] = []
	public medicationsArray: any[] = [{
		id: 1,
		medication: '',
		dosage: '',
		duration: '',
		notes: '',
		isRequired: false
	},{
		id: 2,
		medication: '',
		dosage: '',
		duration: '',
		notes: '',
		isRequired: false
	},{
		id: 3,
		medication: '',
		dosage: '',
		duration: '',
		notes: '',
		isRequired: false
	}];
	
	public objMedicationLength: any[] = [{
		id: 1
	},{
		id: 2
	},{
		id: 3
	}];
	//public objMedicationLength: any[] = []
	public attachmentFiles: any[] = []
	paramPatientId: any;
	constructor(private dataService: ApiDataService, private router: Router, private utility: UtilityService, private usr: AccdetailsService, private utilitydev: UtilityServicedev, private route: ActivatedRoute) {
		this.paramPatientId = this.route.snapshot.paramMap.get('patientId');
	}

	ngOnInit(): void {
		this.getallpatiant();
	}
	getallpatiant() {
		this.tabledata = '';
		this.objInsuranceview = '';
		Swal.fire({
			title: 'Loading....',
			showConfirmButton: false,
			timer: 2200
		});
				//alert(this.cv);
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
				this.tabledata = JSON.parse(Response.toString());
				//alert(this.tabledata.image);
				this.patientImage = this.tabledata.image;
				this.saveActiveInactive = this.tabledata.isActive;
				if(this.tabledata.medication.length > 0)
				{
					this.objMedicationLength = Array();
				}
				this.objInsuranceview = this.tabledata.insurance;
				this.objInsurance = JSON.stringify(this.tabledata.insurance);
				if(this.tabledata.medication.length > 0)
				{
					this.objMedicationLength = Array();
					this.medicationsArray = Array();
					for(var i = 0; i < this.tabledata.medication.length; i++)
					{
						this.objMedicationLength.push({
						  id: i + 1
						});
						if(this.tabledata.medication[i].medication != '' || this.tabledata.medication[i].dosage != '' || this.tabledata.medication[i].duration != '' || this.tabledata.medication[i].notes != ''){
						this.medicationsArray.push({
							id: i + 1,
							medication: this.tabledata.medication[i].medication,
							dosage: this.tabledata.medication[i].dosage,
							duration: this.tabledata.medication[i].duration,
							notes: this.tabledata.medication[i].notes,
							isRequired: true
						});
						}
						else{
						this.medicationsArray.push({
							id: i + 1,
							medication: this.tabledata.medication[i].medication,
							dosage: this.tabledata.medication[i].dosage,
							duration: this.tabledata.medication[i].duration,
							notes: this.tabledata.medication[i].notes,
							isRequired: false
						});
						}
					}
				}
				setTimeout(()=>{     
					if(this.tabledata.image)
					{
						this.setcvImage(this.tabledata.image);
					}
					this.setcvFast();
				}, 1000);
			}
		}, error => {
		  if (error.status === 404)
			Swal.fire('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			Swal.fire('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			Swal.fire('Wrong Password,please try again');
		  else if (error.status === 401)
			Swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			Swal.fire(error.error);
		  else
			Swal.fire('Unable to fetch the data, please try again');
		});
	}
	setcvFast()
	{
		this.cv.setCvfast(this.tabledata.notes);
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
			Swal.fire('E-Mail ID does not exists,please signup to continue');
		  else if (error.status === 403)
			Swal.fire('Account Disabled,contact Dental-Live');
		  else if (error.status === 400)
			Swal.fire('Wrong Password,please try again');
		  else if (error.status === 401)
			Swal.fire('Account Not Verified,Please activate the account from the Email sent to the Email address.');
		  else if (error.status === 428)
			Swal.fire(error.error);
		  else
			Swal.fire('Unable to fetch the data, please try again');
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
      let allowedtypes = ['image', 'video', 'audio', 'pdf', 'msword', 'ms-excel'];
     if (!allowedtypes.some(type => event.target.files[0]['type'].includes(type))) {
	  Swal.fire("File Extenion Not Allowed");
	  return;
	} else {
	  this.attachmentFiles = Array();
	  this.attachmentFiles.push({ name: this.getUniqueName(event.target.files[0]['name']), binaryData: event.target.files[0] });
	}
    }
  }
	numberOnly(event:any): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		  return false;
		}
		return true;

	}
	
	deletepatiant(patientId: any) {
		let url = this.utility.apiData.userPatients.ApiUrl;
		this.dataService.deletePatientData(url, patientId).subscribe(Response => {
			Swal.fire("Patient deleted successfully");
			this.router.navigate(['patients/patients-list']);
		}, (error) => {
		  Swal.fire("Unable to fetch data, please try again");
		  return false;
		});
	}
	onSubmitInsurance(form: NgForm) {
	  const json: JSON = form.value;
	  this.objInsurance = JSON.stringify(json);
	}
	onGetdateData(data: any)
	{
		//alert(this.cv.returnCvfast().isTrue);
		this.jsonObj['firstName'] = data.firstName;
		this.jsonObj['lastName'] = data.lastName;
		this.jsonObj['dob'] = Date.parse(data.dob);
		this.jsonObj['email'] = data.email;
		this.jsonObj['patientId'] = data.patientId;
		this.jsonObj['residingState'] = data.residingState;
		this.jsonObj['isActive'] = this.patiantStatus;
		if(data.refId)
		{
		this.jsonObj['refId'] = data.refId;
		}
		if(data.phone)
		{
		this.jsonObj['phone'] = data.phone;
		}
		if(data.city)
		{
		this.jsonObj['city'] = data.city;
		}
		if(data.address)
		{
		this.objAddress['street'] = data.address;
		this.jsonObj['address'] = this.objAddress;
		}
		if((this.cv.returnCvfast().text != '') || (this.cv.returnCvfast().links.length > 0))
		{
		//alert(JSON.stringify(this.cv.returnCvfast()));
		this.jsonObj['notes'] = this.cv.returnCvfast();
		}
		if(data.gender)
		{
		this.jsonObj['gender'] = parseInt(data.gender);
		}
		if(this.patientImgdata)
		{
		this.jsonObj['image'] = this.patientImgdata;
		}
		this.jsonObj['insurance'] = JSON.parse(this.objInsurance);
		this.jsonObj['medication'] = this.medicationsArray;
		//alert(JSON.stringify(this.jsonObj));
		//alert(JSON.stringify(this.medicationsArray));
		this.cv.processFiles(this.utility.apiData.userPatients.ApiUrl, this.jsonObj, true, 'Patient updated successfully', 'patients/patients-list', 'put', '','notes');
	}
	removeImage()
	{
		this.patientImgdata = '';
		this.patientImage = '';
	}
	onSubmit(form: NgForm) {
	//alert(JSON.stringify(this.cv.returnCvfast()));
		if (form.invalid) {
		  form.form.markAllAsTouched();
		  return;
		}
		if(form.value.image)
		{
			let requests = this.attachmentFiles.map((object) => {
			  return this.utilitydev.uploadBinaryData(object["name"], object["binaryData"], this.module);
			});
			Promise.all(requests)
			  .then((values) => {
				this.attachmentFiles = [];
				//console.log(this.cvfast);
				this.patientImgdata = values[0];
				this.onGetdateData(form.value);
			  })
			  .catch((error) => {
				console.log(error);
				return false;
			  });
		}
		else{
			this.patientImgdata = this.patientImage;
			this.onGetdateData(form.value);
		}
	};
  addMedication() {
	this.objMedicationLength.push({
      id: this.medicationsArray.length + 1
    });
    this.medicationsArray.push({
      medication: '',
      dosage: '',
      duration: '',
      notes: '',
      isRequired: false
    });
  }

  removeMedication(i: number): void {
	if (this.medicationsArray.length > 1) this.medicationsArray.splice(i, 1);
	this.objMedicationLength = Array();
	for(var k = 0; k < this.medicationsArray.length; k++)
	{
		this.objMedicationLength.push({
		  id: k+1
		});
	}
	//alert(JSON.stringify(this.objMedicationLength));
    //else this.medications.patchValue([{medication: null, dosage: null, duration: null, notes: null}]);
  }
  onSubmitMedication(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
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
  
  confirmBox(){
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
	  confirmButtonColor: '#0070D2',
	  cancelButtonColor: '#F7517F',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }
	addMedicationValidation(i: number, str: string, event: any): void {
	if(this.medicationsArray[i].medication != '' || this.medicationsArray[i].dosage != '' || this.medicationsArray[i].duration != '' || this.medicationsArray[i].notes != ''){
		this.medicationsArray[i].isRequired=true;
	}
	else{
		this.medicationsArray[i].isRequired=false;
	}
		if(str == 'medication')
		{
		this.medicationsArray[i].medication=event.target.value;
		}
		if(str == 'dosage')
		{
		this.medicationsArray[i].dosage=event.target.value;
		}
		if(str == 'duration')
		{
		this.medicationsArray[i].duration=event.target.value;
		}
		if(str == 'notes')
		{
		this.medicationsArray[i].notes=event.target.value;
		}
		//alert(JSON.stringify(this.medications));
  }
}
