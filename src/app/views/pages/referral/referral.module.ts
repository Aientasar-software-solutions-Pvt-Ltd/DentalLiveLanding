import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReferralComponent } from './referral.component';
import { ReferralListComponent } from './referral-list/referral-list.component';
import { ReferralAddComponent } from './referral-add/referral-add.component';
import { ReferralAddMembersComponent } from './referral-add-members/referral-add-members.component';
import { ReferralDetailsComponent } from './referral-details/referral-details.component';
import { ReferralEditComponent } from './referral-edit/referral-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkOrdersModule } from '../work-orders/work-orders.module';
import { PatientsModule } from '../patients/patients.module';
import { ReferralGuideComponent } from './referral-guide/referral-guide.component';

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
        path: 'referral-list',
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
        path: 'referral-details/:referralId',
        component: ReferralDetailsComponent
      },
	  {
        path: 'referral-edit/:referralId',
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
    ReferralEditComponent,
	ReferralGuideComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule,
	NgSelectModule,
	FormsModule,
	ReactiveFormsModule,
	PatientsModule,
	WorkOrdersModule
  ],
  schemas: [
	  CUSTOM_ELEMENTS_SCHEMA
	]
})
export class ReferralModule { }
