import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkOrdersComponent } from './work-orders.component';
import { WorkOrdersListComponent } from './work-orders-list/work-orders-list.component';
import { WorkOrderDetailsComponent } from './work-order-details/work-order-details.component';
import { WorkOrderAddMembersComponent } from './work-order-add-members/work-order-add-members.component';
import { WorkOrderAddComponent } from './work-order-add/work-order-add.component';
import { WorkOrderEditComponent } from './work-order-edit/work-order-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientsModule } from '../patients/patients.module';
import { WorkOrderGuideComponent } from './work-order-guide/work-order-guide.component';

const routes: Routes = [
  {
    path: '',
    component: WorkOrdersComponent,
    children: [
      {
        path: '',
        redirectTo: 'work-orders',
        pathMatch: 'full',
      },
	  {
        path: 'work-orders',
        component: WorkOrdersListComponent
      },
	  {
        path: 'work-order-details',
        component: WorkOrderDetailsComponent
      },
	  {
        path: 'work-order-add-members',
        component: WorkOrderAddMembersComponent
      },
	  {
        path: 'work-order-add',
        component: WorkOrderAddComponent
      },
	  {
        path: 'work-order-edit',
        component: WorkOrderEditComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
	WorkOrdersComponent,
    WorkOrdersListComponent,
    WorkOrderDetailsComponent,
    WorkOrderAddMembersComponent,
    WorkOrderAddComponent,
    WorkOrderEditComponent,
    WorkOrderGuideComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	DataTablesModule,
	FormsModule,
	NgSelectModule,
    AutocompleteLibModule,
	PatientsModule,
    ReactiveFormsModule					 
  ],
   schemas: [
	  CUSTOM_ELEMENTS_SCHEMA
	]
})
export class WorkOrdersModule { }
