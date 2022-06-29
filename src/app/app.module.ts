import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgwWowModule } from 'ngx-wow';

import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './views/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';

import { AppComponent } from './app.component';
import { Cvfast } from './cvfast/cvfast.component';
import { HttpClientModule } from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [
    AppComponent,
    Cvfast,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
	BrowserAnimationsModule,
	FormsModule,
	ReactiveFormsModule,
    AppRoutingModule,
	LayoutModule,
    PickerModule,
	NgwWowModule
  ],
  providers: [
	AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
