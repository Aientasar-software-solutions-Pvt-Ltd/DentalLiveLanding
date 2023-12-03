import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { PermissionGuardService } from '../permission-guard.service';
import { AccountGuardServiceService } from '../account-guard-service.service';
import { AddroleComponent } from '../roles/addrole/addrole.component';
import { RolelistComponent } from '../roles/rolelist/rolelist.component';
import { AddsubusersComponent } from '../subuser/addsubusers/addsubusers.component';
import { SubuserslistComponent } from '../subuser/subuserslist/subuserslist.component';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { AddaccountComponent } from './addaccount/addaccount.component';
import { MypurchasesComponent } from './purchases/mypurchases/mypurchases.component';
import { UsagestatisticsComponent } from './usagestatistics/usagestatistics.component';
import { EditsubaccountComponent } from './editsubaccount/editsubaccount.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseComponent } from './purchases/purchase/purchase.component';
import { PackagesListComponent } from './purchases/packages-list/packages-list.component';
import { PackagesDetailsComponent } from './purchases/packages-details/packages-details.component';
import "@lottiefiles/lottie-player";
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddPracticeComponent } from './practice/add-practice/add-practice.component';
import { ListPracticeComponent } from './practice/list-practice/list-practice.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';

const routes: Routes = [
  {
    path: 'subaccount',
    component: EditsubaccountComponent
  },
  { path: 'packages', component: PackagesListComponent },
  { path: 'packages/:id', component: PackagesDetailsComponent },
  { path: 'payment/:id', component: PurchaseComponent },
  { path: 'payment/:id/:addonID', component: PurchaseComponent },
  {
    path: 'details',
    component: AccountDashboardComponent,
    canActivate: [AccountGuardServiceService],
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      { path: 'account', component: AddaccountComponent },

      { path: 'practices', component: ListPracticeComponent },
      { path: 'practices/practice-add', component: AddPracticeComponent },
      { path: 'practices/practice-edit/:id', component: AddPracticeComponent },

      { path: 'roles', component: RolelistComponent },
      { path: 'roles/role', component: AddroleComponent },
      { path: 'roles/role/:id', component: AddroleComponent },

      { path: 'subusers', component: SubuserslistComponent },
      { path: 'subusers/subuser', component: AddsubusersComponent },
      { path: 'subusers/subuser/:id', component: AddsubusersComponent },

      { path: 'purchases', component: MypurchasesComponent },

      { path: 'usage', component: UsagestatisticsComponent },
    ]
  }
]

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    AccountDashboardComponent,
    AddaccountComponent,
    RolelistComponent,
    AddroleComponent,
    SubuserslistComponent,
    AddsubusersComponent,
    MypurchasesComponent,
    UsagestatisticsComponent,
    EditsubaccountComponent,
    PurchaseComponent,
    PackagesListComponent,
    PackagesDetailsComponent,
    ProfileViewComponent,
    AddPracticeComponent,
    ListPracticeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ImageCropperModule,
    NgxShimmerLoadingModule,
    DataTablesModule,
    ReactiveFormsModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
  ],
  providers: [
    DatePipe
  ]

})
export class AccountsModule { }
