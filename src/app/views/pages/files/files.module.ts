import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { FilesComponent } from './files.component';
import { AllFilesComponent } from './all-files/all-files.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
    children: [
      {
        path: '',
        redirectTo: 'files',
        pathMatch: 'full',
      },
	  {
        path: 'files',
        component: AllFilesComponent
      },
	  {
        path: 'file-details',
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
    ReactiveFormsModule
  ]
})
export class FilesModule { }
