import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MailInboxComponent } from './mail-inbox/mail-inbox.component';
import { VideojsRecordComponent } from './videojs-record/videojs-record.component';
import { ViewAttachmentComponent } from './view-attachment/view-attachment.component';
import { ViewMailComponent } from './view-mail/view-mail.component';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule, MatPaginatorModule, MatSortModule, MatTabsModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { MailDashboardComponent } from './mail-dashboard/mail-dashboard.component';
import "@lottiefiles/lottie-player";

const routes: Routes = [
  {
    path: '',
    component: MailDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'inbox',
        pathMatch: 'full',
      },
      { path: 'inbox', component: MailInboxComponent },
      { path: 'sent', component: MailInboxComponent },

    ]
  },
  { path: 'compose', component: VideojsRecordComponent },
  { path: 'compose/:patientId', component: VideojsRecordComponent },
  { path: 'compose/:patientId/:caseId', component: VideojsRecordComponent },
  { path: 'view/:type/:id', component: ViewMailComponent }
]

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    MailInboxComponent,
    VideojsRecordComponent,
    ViewAttachmentComponent,
    ViewMailComponent,
    MailDashboardComponent
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
  ],
  providers: [
    DatePipe
  ]
})
export class MailsModule { }
