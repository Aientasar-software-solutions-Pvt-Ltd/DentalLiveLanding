import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DataTablesModule } from "angular-datatables";
import { CasesComponent } from './cases.component';
import { CaseListComponent } from './case-list/case-list.component';
import { CaseAddComponent } from './case-add/case-add.component';
import { CaseEditComponent } from './case-edit/case-edit.component';
import { CaseAddInviteMembersComponent } from './case-add-invite-members/case-add-invite-members.component';
import { CaseAddTaskAddComponent } from './case-add-task-add/case-add-task-add.component';
import { CaseAddFileUploadComponent } from './case-add-file-upload/case-add-file-upload.component';
import { MilestoneAddComponent } from './case-add-milestone/milestone-add.component';
import { PatientsModule } from '../patients/patients.module';

const routes: Routes = [
  {
    path: '',
    component: CasesComponent,
    children: [
      {
        path: '',
        redirectTo: 'case-list',
        pathMatch: 'full',
      },
	  {
        path: 'case-list',
        component: CaseListComponent
      },
	  {
        path: 'case-add',
        component: CaseAddComponent
      },
	  {
        path: 'case-add-invite-members',
        component: CaseAddInviteMembersComponent
      },
	  {
        path: 'case-add-milestone',
        component: MilestoneAddComponent
      },
	  {
        path: 'case-add-task-add',
        component: CaseAddTaskAddComponent
      },
	  {
        path: 'case-add-file-upload',
        component: CaseAddFileUploadComponent
      },
	  {
        path: 'case-edit/:caseId',
        component: CaseEditComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    CasesComponent,
    CaseListComponent,
    CaseAddComponent,
    CaseEditComponent,
    MilestoneAddComponent,
    CaseAddInviteMembersComponent,
    CaseAddTaskAddComponent,
    CaseAddFileUploadComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule,
	NgSelectModule,
	PatientsModule,
	OwlDateTimeModule,
	FormsModule,
    AutocompleteLibModule,
	ReactiveFormsModule,
    OwlNativeDateTimeModule,
  ],
  schemas: [
	  CUSTOM_ELEMENTS_SCHEMA
	],
})
export class CasesModule { }
