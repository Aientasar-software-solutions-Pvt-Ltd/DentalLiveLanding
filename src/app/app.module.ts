import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgwWowModule } from 'ngx-wow';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	NgwWowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
