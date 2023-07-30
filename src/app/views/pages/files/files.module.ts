import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { FilesComponent } from './files.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { AddFilesComponent } from './add-files/add-files.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilesListComponent } from './files-list/files-list.component';
import { CvfastModuleModule } from 'src/app/cvfastFiles/cvfast-module/cvfast-module.module';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
    children: [
      {
        path: '',
        redirectTo: 'files-list',
        pathMatch: 'full',
      },
      //currently files is only from cases
      // {
      //   path: 'files-list',
      //   component: FilesListComponent
      // },
      // {
      //   path: 'files-add',
      //   component: AddFilesComponent
      // },
      // {
      //   path: 'files-add',
      //   component: AddFilesComponent
      // },
      // {
      //   path: 'files-edit/:id',
      //   component: AddFilesComponent
      // }
    ]
  }
]

@NgModule({
  declarations: [
    FilesComponent,
    AddFilesComponent,
    FilesListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    CvfastModuleModule,
    ReactiveFormsModule,
    NgxShimmerLoadingModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FilesModule { }
