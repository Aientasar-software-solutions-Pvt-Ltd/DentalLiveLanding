import { CvfastModuleModule } from 'src/app/cvfastFiles/cvfast-module/cvfast-module.module';
import { CasesModule } from './../cases/cases.module';

import { PatientAddComponent } from './patient-add/patient-add.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { PatientsComponent } from './patients.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { ImageCropperModule } from 'ngx-image-cropper';

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      {
        path: '',
        component: PatientsListComponent
      },
      {
        path: 'patient-detail/:id',
        component: PatientDetailsComponent
      },
      {
        path: 'patient-add',
        component: PatientAddComponent
      },
      {
        path: 'patient-edit/:id',
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
    PatientAddComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    PickerModule,
    RouterModule.forChild(routes),
    NgxShimmerLoadingModule,
    DataTablesModule,
    CvfastModuleModule,
    CasesModule,
    ReactiveFormsModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
    ImageCropperModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientsModule { }
