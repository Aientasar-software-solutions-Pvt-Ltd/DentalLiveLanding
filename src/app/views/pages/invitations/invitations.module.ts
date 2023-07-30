import { CvfastModuleModule } from './../../../cvfastFiles/cvfast-module/cvfast-module.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { InvitationsComponent } from './invitations.component';
import { InvitationListsComponent } from './invitation-lists/invitation-lists.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientsModule } from '../patients/patients.module';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { ColleagueListComponent } from './colleague-list/colleague-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileViewComponent } from '../acccounts/profile-view/profile-view.component';

const routes: Routes = [
  {
    path: '',
    component: InvitationsComponent,
    children: [
      {
        path: 'invitation-lists',
        component: InvitationListsComponent
      },
      {
        path: 'colleague-lists',
        component: ColleagueListComponent
      },
      {
        path: 'colleague-lists/:id',
        component: ProfileViewComponent
      },

    ]
  }
]

@NgModule({
  declarations: [
    InvitationsComponent,
    InvitationListsComponent,
    ColleagueListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    CvfastModuleModule,
    ReactiveFormsModule,
    PatientsModule,
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
export class InvitationsModule { }
