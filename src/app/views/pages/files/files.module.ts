import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { FilesComponent } from './files.component';
import { AllFilesComponent } from './all-files/all-files.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
    children: [
      {
        path: '',
        redirectTo: 'casefiles',
        pathMatch: 'full',
      },
	  {
        path: ':dateCreated/:caseId',
        component: AllFilesComponent
      },
	  {
        path: 'file-details/:filesId/:caseId',
        component: FileDetailsComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    FilesComponent,
    AllFilesComponent,
    FileDetailsComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule,
	FormsModule,
    ReactiveFormsModule,
	NgxShimmerLoadingModule
  ],
  schemas: [
	  CUSTOM_ELEMENTS_SCHEMA
	]
})
export class FilesModule { }
