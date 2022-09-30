import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ViewAttachmentComponent } from './views/pages/mails/view-attachment/view-attachment.component';
import { PermissionGuardService } from './views/pages/permission-guard.service';

const routes: Routes = [
	{ path: 'file/:key', component: ViewAttachmentComponent },
	{ path: '', loadChildren: () => import('./views/pages/general/general.module').then(m => m.GeneralModule) },
	{ path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
	{
		path: '',
		component: BaseComponent,
		//permission guard to be added
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'accounts',
				loadChildren: () => import('./views/pages/acccounts/accounts.module').then(m => m.AccountsModule),
				canActivate: [AuthGuard]
			},
			{
				path: 'patients',
				loadChildren: () => import('./views/pages/patients/patients.module').then(m => m.PatientsModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'cases',
				loadChildren: () => import('./views/pages/cases/cases.module').then(m => m.CasesModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'colleagues',
				loadChildren: () => import('./views/pages/colleagues/colleagues.module').then(m => m.ColleaguesModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'referrals',
				loadChildren: () => import('./views/pages/referral/referral.module').then(m => m.ReferralModule),
				canActivate: [AuthGuard, PermissionGuardService],
			},
			{
				path: 'workorders',
				loadChildren: () => import('./views/pages/workorders/work-orders.module').then(m => m.WorkOrdersModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'cases-view',
				loadChildren: () => import('./views/pages/master/master.module').then(m => m.MasterModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'caseinvites',
				loadChildren: () => import('./views/pages/invitations/invitations.module').then(m => m.InvitationsModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'milestones',
				loadChildren: () => import('./views/pages/milestones/milestones.module').then(m => m.MilestonesModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'casefiles',
				loadChildren: () => import('./views/pages/files/files.module').then(m => m.FilesModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'mail',
				loadChildren: () => import('./views/pages/mails/mails.module').then(m => m.MailsModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'meet',
				loadChildren: () => import('./views/pages/meet/meet.module').then(m => m.MeetModule),
				canActivate: [AuthGuard, PermissionGuardService]
			},
			{
				path: 'contacts',
				loadChildren: () => import('./views/pages/contacts/contacts.module').then(m => m.ContactsModule),
				canActivate: [AuthGuard, PermissionGuardService]
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
