//@ts-nocheck
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { ColleaguesComponent } from './colleagues.component';
import { ColleaguesListComponent } from './colleagues-list/colleagues-list.component';
import { ColleagueViewInviteComponent } from './colleague-view-invite/colleague-view-invite.component';
import { ColleaguesAddMembersComponent } from './colleagues-add-members/colleagues-add-members.component';
import { ColleagueViewProfileComponent } from './colleague-view-profile/colleague-view-profile.component';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';

import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
const routes: Routes = [
  {
    path: '',
    component: ColleaguesComponent,
    children: [
      {
        path: '',
        redirectTo: 'colleagues-list',
        pathMatch: 'full',
      },
	  {
        path: 'colleagues-list',
        component: ColleaguesListComponent
      },
	  {
        path: 'colleague-view-invite',
        component: ColleagueViewInviteComponent
      },
	  {
        path: 'colleagues-add-members',
        component: ColleaguesAddMembersComponent
      },
	  {
        path: 'colleague-view-profile/:profileId/:caseId',
        component: ColleagueViewProfileComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ColleaguesComponent,
    ColleaguesListComponent,
    ColleagueViewInviteComponent,
    ColleaguesAddMembersComponent,
    ColleagueViewProfileComponent
  ],
  imports: [
	FormsModule,
    CommonModule,
	RouterModule.forChild(routes),
	NgxShimmerLoadingModule,
	DataTablesModule,
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
export class ColleaguesModule { }
