import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MilestonesComponent } from './milestones.component';
import { MilestonesListComponent } from './milestones-list/milestones-list.component';
import { MilestoneDetailsComponent } from './milestone-details/milestone-details.component';
import { MilestoneAddMembersComponent } from './milestone-add-members/milestone-add-members.component';
import { MilestoneAddComponent } from './milestone-add/milestone-add.component';
import { MilestoneEditComponent } from './milestone-edit/milestone-edit.component';
import { GeneralTaskAddComponent } from './general-task-add/general-task-add.component';
import { GeneralTaskEditComponent } from './general-task-edit/general-task-edit.component';
import { GeneralTaskViewComponent } from './general-task-view/general-task-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientsModule } from '../patients/patients.module';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';

const routes: Routes = [
  {
    path: '',
    component: MilestonesComponent,
    children: [
      {
        path: '',
        redirectTo: 'milestones-list',
        pathMatch: 'full',
      },
	  {
        path: 'milestones-list',
        component: MilestonesListComponent
      },
	  {
        path: 'milestone-details/:milestoneId',
        component: MilestoneDetailsComponent
      },
	  {
        path: 'milestone-add-members',
        component: MilestoneAddMembersComponent
      },
	  {
        path: 'milestone-add/:caseId',
        component: MilestoneAddComponent
      },
	  {
        path: 'milestone-edit/:milestoneId',
        component: MilestoneEditComponent
      },
	  {
        path: 'general-task-add',
        component: GeneralTaskAddComponent
      },
	  {
        path: 'general-task-edit/:taskId',
        component: GeneralTaskEditComponent
      },
	  {
        path: 'general-task-view/:taskId',
        component: GeneralTaskViewComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    MilestonesComponent,
    MilestonesListComponent,
    MilestoneDetailsComponent,
    MilestoneAddMembersComponent,
    MilestoneAddComponent,
    MilestoneEditComponent,
    GeneralTaskAddComponent,
    GeneralTaskEditComponent,
    GeneralTaskViewComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule,
	NgSelectModule,
	PatientsModule,
	OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
	NgxShimmerLoadingModule,
    ReactiveFormsModule
  ],
  schemas: [
	  CUSTOM_ELEMENTS_SCHEMA
	]
})
export class MilestonesModule { }
