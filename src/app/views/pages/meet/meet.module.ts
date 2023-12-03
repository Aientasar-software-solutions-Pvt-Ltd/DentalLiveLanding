import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { MeetingComponent } from './meeting/meeting.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { CdkTableModule } from '@angular/cdk/table';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTabsModule, MatAutocompleteModule } from '@angular/material';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'meeting', component: MeetingComponent },
  { path: 'meeting', component: MeetingComponent },
  { path: 'meet/:patientId', component: ListComponent },
  { path: 'meet/:patientId/:caseId', component: ListComponent },
  { path: 'meet/:patientId/:caseId', component: ListComponent },
]

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    ListComponent,
    MeetingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SocialLoginModule,
    MatFormFieldModule,
    MatInputModule,
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    NgxShimmerLoadingModule,
    MatAutocompleteModule,
    RouterModule.forChild(routes)
  ]
})
export class MeetModule { }
