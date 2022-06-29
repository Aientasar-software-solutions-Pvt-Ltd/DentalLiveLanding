import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { ReferralComponent } from './referral.component';
import { ReferralListComponent } from './referral-list/referral-list.component';
import { ReferralAddComponent } from './referral-add/referral-add.component';
import { ReferralAddMembersComponent } from './referral-add-members/referral-add-members.component';
import { ReferralDetailsComponent } from './referral-details/referral-details.component';
import { ReferralEditComponent } from './referral-edit/referral-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ReferralComponent,
    children: [
      {
        path: '',
        redirectTo: 'referral',
        pathMatch: 'full',
      },
	  {
        path: 'referral',
        component: ReferralListComponent
      },
	  {
        path: 'referral-add',
        component: ReferralAddComponent
      },
	  {
        path: 'referral-add-members',
        component: ReferralAddMembersComponent
      },
	  {
        path: 'referral-details',
        component: ReferralDetailsComponent
      },
	  {
        path: 'referral-edit',
        component: ReferralEditComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ReferralComponent,
    ReferralListComponent,
    ReferralAddComponent,
    ReferralAddMembersComponent,
    ReferralDetailsComponent,
    ReferralEditComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule,
	NgSelectModule
  ]
})
export class ReferralModule { }
