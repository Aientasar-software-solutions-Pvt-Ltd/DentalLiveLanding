import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { PatientsComponent } from './patients.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientCaseListComponent } from './patient-case-list/patient-case-list.component';
import { PatientAddComponent } from './patient-add/patient-add.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Cvfast } from 'src/app/cvfast/cvfast.component';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';
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
        path: 'patient-details/:patientId',
        component: PatientDetailsComponent
      },
      {
        path: 'patient-edit/:patientId',
        component: PatientEditComponent
      },
      {
        path: 'patient-case-list/:patientId',
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
    PatientAddComponent,
    Cvfast
  ],
  exports: [
    Cvfast,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PickerModule,
    RouterModule.forChild(routes),
	NgxShimmerLoadingModule ,
    DataTablesModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientsModule { }
