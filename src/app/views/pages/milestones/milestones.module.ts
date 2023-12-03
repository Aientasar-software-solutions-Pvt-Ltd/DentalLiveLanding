import { CasesModule } from './../cases/cases.module';
import { CvfastModuleModule } from 'src/app/cvfastFiles/cvfast-module/cvfast-module.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MilestonesComponent } from './milestones.component';
import { MilestonesListComponent } from './milestones-list/milestones-list.component';
import { MilestoneDetailsComponent } from './milestone-details/milestone-details.component';
import { MilestoneAddComponent } from './milestone-add/milestone-add.component';
import { GeneralTaskAddComponent } from './general-task-add/general-task-add.component';
import { GeneralTaskViewComponent } from './general-task-view/general-task-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { MilestoneDetailMasterComponent } from './milestone-detail-master/milestone-detail-master.component';
import { GeneralTaskListComponent } from './general-task-list/general-task-list.component';
const routes: Routes = [
  {
    path: '',
    component: MilestonesComponent,
    children: [
      {
        path: '',
        component: MilestonesListComponent
      },
      {
        path: 'milestone-details/:milestoneId',
        component: MilestoneDetailMasterComponent,
        children: [
          {
            path: '',
            component: MilestoneDetailsComponent
          },
          {
            path: 'task-add',
            component: GeneralTaskAddComponent
          },
          {
            path: 'task-edit/:taskId',
            component: GeneralTaskAddComponent
          },
          {
            path: 'task-details/:taskId',
            component: GeneralTaskViewComponent
          }
        ]
      },
      {
        path: 'milestone-add',
        component: MilestoneAddComponent
      },
      {
        path: 'milestone-add/:id',
        component: MilestoneAddComponent
      },
      {
        path: 'milestone-add/:id/:cid',
        component: MilestoneAddComponent
      },
      {
        path: 'milestone-edit/:id',
        component: MilestoneAddComponent
      },

    ]
  }
]

@NgModule({
  declarations: [
    MilestonesComponent,
    MilestonesListComponent,
    MilestoneDetailsComponent,
    MilestoneAddComponent,
    GeneralTaskAddComponent,
    GeneralTaskViewComponent,
    MilestoneDetailMasterComponent,
    GeneralTaskListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    NgSelectModule,
    CasesModule,
    CvfastModuleModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    NgxShimmerLoadingModule,
    ReactiveFormsModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MilestonesModule { }
