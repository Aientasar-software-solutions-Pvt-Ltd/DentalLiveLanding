import { CvfastModuleModule } from 'src/app/cvfastFiles/cvfast-module/cvfast-module.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { ReferralComponent } from './referral.component';
import { ReferralListComponent } from './referral-list/referral-list.component';
import { ReferralAddComponent } from './referral-add/referral-add.component';
import { ReferralDetailsComponent } from './referral-details/referral-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReferralGuideComponent } from './referral-guide/referral-guide.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { CasesModule } from '../cases/cases.module';

const routes: Routes = [
  {
    path: '',
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
        path: 'referral-add/:id',
        component: ReferralAddComponent
      },
      {
        path: 'referral-add/:id/:cid',
        component: ReferralAddComponent
      },
      {
        path: 'referral-edit/:id',
        component: ReferralAddComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ReferralComponent,
    ReferralListComponent,
    ReferralAddComponent,
    ReferralDetailsComponent,
    ReferralGuideComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CasesModule,
    CvfastModuleModule,
    NgxShimmerLoadingModule,
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
export class ReferralModule { }
