import { CasesModule } from './../cases/cases.module';
import { CvfastModuleModule } from 'src/app/cvfastFiles/cvfast-module/cvfast-module.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkOrdersComponent } from './work-orders.component';
import { WorkOrdersListComponent } from './work-orders-list/work-orders-list.component';
import { WorkOrderDetailsComponent } from './work-order-details/work-order-details.component';
import { WorkOrderAddComponent } from './work-order-add/work-order-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkOrderGuideComponent } from './work-order-guide/work-order-guide.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';

import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
const routes: Routes = [
    {
        path: '',
        component: WorkOrdersComponent,
        children: [
            {
                path: '',
                component: WorkOrdersListComponent
            },
            {
                path: 'work-order-details/:id',
                component: WorkOrderDetailsComponent
            },
            {
                path: 'work-order-add',
                component: WorkOrderAddComponent
            },
            {
                path: 'work-order-add/:id',
                component: WorkOrderAddComponent
            },
            {
                path: 'work-order-add/:id/:cid',
                component: WorkOrderAddComponent
            },
            {
                path: 'work-order-edit/:id',
                component: WorkOrderAddComponent
            }
        ]
    }
]

@NgModule({
    declarations: [
        WorkOrdersComponent,
        WorkOrdersListComponent,
        WorkOrderDetailsComponent,
        WorkOrderAddComponent,
        WorkOrderGuideComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        DataTablesModule,
        FormsModule,
        NgSelectModule,
        AutocompleteLibModule,
        CasesModule,
        CvfastModuleModule,
        ReactiveFormsModule,
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
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class WorkOrdersModule { }
