import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ViewAttachmentComponent } from './views/pages/mails/view-attachment/view-attachment.component';

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
				path: 'accounts',
				loadChildren: () => import('./views/pages/acccounts/accounts.module').then(m => m.AccountsModule)
			},
			{
				path: 'mail',
				loadChildren: () => import('./views/pages/mails/mails.module').then(m => m.MailsModule)
			},
			{
				path: 'meet',
				loadChildren: () => import('./views/pages/meet/meet.module').then(m => m.MeetModule)
			},
			{
				path: 'contacts',
				loadChildren: () => import('./views/pages/contacts/contacts.module').then(m => m.ContactsModule)
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
