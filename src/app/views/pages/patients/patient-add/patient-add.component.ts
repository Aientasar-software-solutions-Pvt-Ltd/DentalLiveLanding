import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css']
})
export class PatientAddComponent implements OnInit {
	saveActiveInactive: boolean = false;

	onActiveInactiveChanged(value:boolean){
		this.saveActiveInactive = value;
	}
	public medications: any[] = [{
    id: 1,
    medication: '',
    dosage: '',
    duration: '',
    notes: ''
  }];
  constructor() { }

  ngOnInit(): void {
  }
  
  addMedication() {
    this.medications.push({
      id: this.medications.length + 1,
      medication: '',
      dosage: '',
      duration: '',
      notes: ''
    });
  }

  removeMedication(i: number): void {
    //this.medications.splice(i, 1);
	if (this.medications.length > 1) this.medications.splice(i, 1);
    //else this.medications.patchValue([{medication: null, dosage: null, duration: null, notes: null}]);
  }
  
  logValue() {
    console.log(this.medications);
  }

}
