import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddcontactsComponent } from './addcontacts/addcontacts.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTabsModule, MatAutocompleteModule } from '@angular/material';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';


const routes: Routes = [
  { path: '', component: ContactlistComponent },
  { path: 'contacts', component: ContactlistComponent },
  { path: 'contacts/contact', component: AddcontactsComponent },
  { path: 'contacts/contact/:id', component: AddcontactsComponent },
]


@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    AddcontactsComponent,
    ContactlistComponent
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
export class ContactsModule { }
