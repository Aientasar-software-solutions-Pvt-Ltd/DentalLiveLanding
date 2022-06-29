import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { InvitationsComponent } from './invitations.component';
import { InvitationListsComponent } from './invitation-lists/invitation-lists.component';
import { WorkOrderInvitationListComponent } from './work-order-invitation-list/work-order-invitation-list.component';
import { ReferralInvitationListComponent } from './referral-invitation-list/referral-invitation-list.component';
import { CaseInvitationListComponent } from './case-invitation-list/case-invitation-list.component';

const routes: Routes = [
  {
    path: '',
    component: InvitationsComponent,
    children: [
      {
        path: '',
        redirectTo: 'invitations',
        pathMatch: 'full',
      },
	  {
        path: 'invitations',
        component: InvitationListsComponent
      },
	  {
        path: 'work-order-invitation-list',
        component: WorkOrderInvitationListComponent
      },
	  {
        path: 'referral-invitation-list',
        component: ReferralInvitationListComponent
      },
	  {
        path: 'case-invitation-list',
        component: CaseInvitationListComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    InvitationsComponent,
	InvitationListsComponent,
	WorkOrderInvitationListComponent,
	ReferralInvitationListComponent,
	CaseInvitationListComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule
  ]
})
export class InvitationsModule { }
