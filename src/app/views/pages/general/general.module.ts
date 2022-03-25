import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgxPageScrollModule } from 'ngx-page-scroll';
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


const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
	  { path: '', redirectTo: 'home',pathMatch: 'full'},
      {
        path: '',
        component: HomeComponent
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
    BecomeVendorComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),
	CarouselModule,
	NgwWowModule,
	NgxScrollTopModule,
	NgxPageScrollModule,
  ]
})
export class GeneralModule { }
