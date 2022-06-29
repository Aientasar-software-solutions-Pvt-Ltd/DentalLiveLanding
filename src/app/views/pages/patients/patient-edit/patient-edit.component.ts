import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css'],
})
export class PatientEditComponent implements OnInit {

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

}
