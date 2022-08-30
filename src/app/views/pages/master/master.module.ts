import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { PatientsModule } from '../patients/patients.module';
import { MasterComponent } from './master.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
	{
        path: '',
        redirectTo: 'master-list',
        pathMatch: 'full',
	},
	{
		path: 'master-list/:caseId/:tabName',
		component: MasterComponent
	}
]

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
  listPlugin,
  bootstrap5Plugin
]);

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    MasterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FullCalendarModule,
    FormsModule,
    NgSelectModule,
    PatientsModule,
    ReactiveFormsModule,
	DataTablesModule,
    InfiniteScrollModule
  ]
})
export class MasterModule { }
