import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { PatientsComponent } from './patients.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientCaseListComponent } from './patient-case-list/patient-case-list.component';
import { PatientAddComponent } from './patient-add/patient-add.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      {
        path: '',
        redirectTo: 'patients-list',
        pathMatch: 'full',
      },
	  {
        path: 'patients-list',
        component: PatientsListComponent
      },
	  {
        path: 'patient-details',
        component: PatientDetailsComponent
      },
	  {
        path: 'patient-edit',
        component: PatientEditComponent
      },
	  {
        path: 'patient-case-list',
        component: PatientCaseListComponent
      },
	  {
        path: 'patient-add',
        component: PatientAddComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    PatientsComponent,
    PatientsListComponent,
    PatientDetailsComponent,
    PatientEditComponent,
    PatientCaseListComponent,
    PatientAddComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule
  ]
})
export class PatientsModule { }
