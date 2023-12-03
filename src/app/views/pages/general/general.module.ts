import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxScrollTopModule } from 'ngx-scrolltop';
import { NgwWowModule } from 'ngx-wow';
import { CarouselModule } from 'ngx-owl-carousel-o';


import { GeneralComponent } from './general.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SolutionsComponent } from './solutions/solutions.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { BecomeVendorComponent } from './become-vendor/become-vendor.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DentalliveMailComponent } from './dentallive-mail/dentallive-mail.component';
import { DentalliveTalkComponent } from './dentallive-talk/dentallive-talk.component';
import { PlannerDetailsComponent } from './planner-details/planner-details.component';
import { DentalPlannerComponentComponent } from './dental-planner-component/dental-planner-component.component';


const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'planner',
        component: PlannerDetailsComponent
      },
      {
        path: 'solutions',
        component: SolutionsComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: 'terms-of-use',
        component: TermsOfUseComponent
      },
      {
        path: 'become-vendor',
        component: BecomeVendorComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'dentallive-mail',
        component: DentalliveMailComponent
      },
      {
        path: 'dentallive-talk',
        component: DentalliveTalkComponent
      },
      {
        path: 'dentallive-planner',
        component: DentalPlannerComponentComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    GeneralComponent,
    HomeComponent,
    FaqComponent,
    PrivacyPolicyComponent,
    SolutionsComponent,
    TermsOfUseComponent,
    BecomeVendorComponent,
    ContactUsComponent,
    DentalliveMailComponent,
    DentalliveTalkComponent,
    PlannerDetailsComponent,
    DentalPlannerComponentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarouselModule,
    NgwWowModule,
    NgxScrollTopModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class GeneralModule { }
