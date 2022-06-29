import { NgModule } from '@angular/core';
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
        path: 'milestone-details',
        component: MilestoneDetailsComponent
      },
	  {
        path: 'milestone-add-members',
        component: MilestoneAddMembersComponent
      },
	  {
        path: 'milestone-add',
        component: MilestoneAddComponent
      },
	  {
        path: 'milestone-edit',
        component: MilestoneEditComponent
      },
	  {
        path: 'general-task-add',
        component: GeneralTaskAddComponent
      },
	  {
        path: 'general-task-edit',
        component: GeneralTaskEditComponent
      },
	  {
        path: 'general-task-view',
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
	OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class MilestonesModule { }
