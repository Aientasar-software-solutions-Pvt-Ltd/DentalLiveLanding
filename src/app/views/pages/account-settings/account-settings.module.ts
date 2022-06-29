import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccountSettingsComponent } from './account-settings.component';

const routes: Routes = [
  {
    path: '',
    component: AccountSettingsComponent
  }
]

@NgModule({
  declarations: [
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
  ]
})
export class AccountSettingsModule { }
