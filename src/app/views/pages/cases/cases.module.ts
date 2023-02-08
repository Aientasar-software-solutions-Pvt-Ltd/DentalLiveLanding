import { ReferralDetailsComponent } from './../referral/referral-details/referral-details.component';
import { InvitationListsComponent } from './../invitations/invitation-lists/invitation-lists.component';
import { WorkOrdersListComponent } from './../workorders/work-orders-list/work-orders-list.component';
import { FilesListComponent } from './../files/files-list/files-list.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DataTablesModule } from "angular-datatables";
import { CasesComponent } from './cases.component';
import { CaseListComponent } from './case-list/case-list.component';
import { CaseAddComponent } from './case-add/case-add.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { CaseViewMasterComponent } from './case-view-master/case-view-master.component';
import { ReferralListComponent } from '../referral/referral-list/referral-list.component';
import { MilestonesListComponent } from '../milestones/milestones-list/milestones-list.component';
import { CaseDetailsComponent } from './case-details/case-details.component';
import { CaseThreadsComponent } from './case-threads/case-threads.component';
import { CaseMessageComponent } from './case-message/case-message.component';
import { CvfastModuleModule } from 'src/app/cvfastFiles/cvfast-module/cvfast-module.module';
import { AddFilesComponent } from '../files/add-files/add-files.component';
import { WorkOrderDetailsComponent } from '../workorders/work-order-details/work-order-details.component';
import { WorkOrderAddComponent } from '../workorders/work-order-add/work-order-add.component';
import { WorkOrdersComponent } from '../workorders/work-orders.component';
import { FilesComponent } from '../files/files.component';
import { ReferralComponent } from '../referral/referral.component';
import { ReferralAddComponent } from '../referral/referral-add/referral-add.component';
import { GeneralTaskAddComponent } from '../milestones/general-task-add/general-task-add.component';
import { GeneralTaskViewComponent } from '../milestones/general-task-view/general-task-view.component';
import { MilestoneAddComponent } from '../milestones/milestone-add/milestone-add.component';
import { MilestoneDetailsComponent } from '../milestones/milestone-details/milestone-details.component';
import { MilestonesComponent } from '../milestones/milestones.component';
import { CaseMembersComponent } from './case-members/case-members.component';
import { MilestoneDetailMasterComponent } from '../milestones/milestone-detail-master/milestone-detail-master.component';


const routes: Routes = [
  {
    path: 'cases',
    component: CasesComponent,
    children: [
      {
        path: '',
        component: CaseListComponent
      },
      {
        path: 'case-add',
        component: CaseAddComponent
      },
      {
        path: 'case-add/:patientId',
        component: CaseAddComponent
      },
      {
        path: 'case-edit/:id',
        component: CaseAddComponent
      },
      {
        path: 'case-view/:caseId',
        component: CaseViewMasterComponent,
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full',
          },
          {
            path: 'details',
            component: CaseDetailsComponent,
          },
          {
            path: 'messages',
            component: CaseMessageComponent,
          },
          {
            path: 'colleagues',
            component: CaseMembersComponent,
          },
          {
            path: 'workorders',
            component: WorkOrdersComponent,
            children: [
              {
                path: '',
                component: WorkOrdersListComponent
              },
              {
                path: 'work-order-details/:id',
                component: WorkOrderDetailsComponent
              },
              {
                path: 'work-order-add',
                component: WorkOrderAddComponent
              },
              {
                path: 'work-order-edit/:id',
                component: WorkOrderAddComponent
              }
            ]
          },
          {
            path: 'referrals',
            component: ReferralComponent,
            children: [
              {
                path: '',
                component: ReferralListComponent
              },
              {
                path: 'referral-details/:id',
                component: ReferralDetailsComponent
              },
              {
                path: 'referral-add',
                component: ReferralAddComponent
              },
              {
                path: 'referral-edit/:id',
                component: ReferralAddComponent
              }
            ]
          },
          {
            path: 'milestones',
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
                path: 'milestone-edit/:id',
                component: MilestoneAddComponent
              },

            ]
          },
          //speical case as currently only files in case
          {
            path: 'files',
            component: FilesComponent,
            children: [
              {
                path: '',
                component: FilesListComponent
              },
              {
                path: 'files-add',
                component: AddFilesComponent
              },
              {
                path: 'files-edit/:id',
                component: AddFilesComponent
              }
            ]
          },
        ]
      }
    ]
  }
]

@NgModule({
  declarations: [
    CasesComponent,
    CaseListComponent,
    CaseAddComponent,
    CaseViewMasterComponent,
    CaseDetailsComponent,
    CaseThreadsComponent,
    CaseMessageComponent,
    CaseMembersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    NgSelectModule,
    CvfastModuleModule,
    OwlDateTimeModule,
    FormsModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    OwlNativeDateTimeModule,
    NgxShimmerLoadingModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    })
  ],
  exports: [
    CaseThreadsComponent,
    CaseListComponent,
    CaseMessageComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CasesModule { }
