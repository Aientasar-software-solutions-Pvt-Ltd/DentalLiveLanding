import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { Cvfast } from './cvfast/cvfast.component';

const routes: Routes = [
    { path: 'cvfast', component: Cvfast },
	{ path: '', loadChildren: () => import('./views/pages/general/general.module').then(m => m.GeneralModule) },
	{ path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
		  {
			path: 'dashboard',
			loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
		  },
		  {
			path: 'patients',
			loadChildren: () => import('./views/pages/patients/patients.module').then(m => m.PatientsModule)
		  },
		  {
			path: 'cases',
			loadChildren: () => import('./views/pages/cases/cases.module').then(m => m.CasesModule)
		  },
		  {
			path: 'colleagues',
			loadChildren: () => import('./views/pages/colleagues/colleagues.module').then(m => m.ColleaguesModule)
		  },
		  {
			path: 'referral',
			loadChildren: () => import('./views/pages/referral/referral.module').then(m => m.ReferralModule)
		  },
		  {
			path: 'work-orders',
			loadChildren: () => import('./views/pages/work-orders/work-orders.module').then(m => m.WorkOrdersModule)
		  },
		  {
			path: 'master',
			loadChildren: () => import('./views/pages/master/master.module').then(m => m.MasterModule)
		  },
		  {
			path: 'invitations',
			loadChildren: () => import('./views/pages/invitations/invitations.module').then(m => m.InvitationsModule)
		  },
		  {
			path: 'milestones',
			loadChildren: () => import('./views/pages/milestones/milestones.module').then(m => m.MilestonesModule)
		  },
		  {
			path: 'files',
			loadChildren: () => import('./views/pages/files/files.module').then(m => m.FilesModule)
		  },
		  {
			path: 'account-settings',
			loadChildren: () => import('./views/pages/account-settings/account-settings.module').then(m => m.AccountSettingsModule)
		  },
		  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
		]
	},
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
