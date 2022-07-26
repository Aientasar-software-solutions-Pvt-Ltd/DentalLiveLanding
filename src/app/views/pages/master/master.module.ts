import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import { MasterComponent } from './master.component';

const routes: Routes = [
  {
    path: '',
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
  declarations: [
    MasterComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
	DataTablesModule
  ]
})
export class MasterModule { }
