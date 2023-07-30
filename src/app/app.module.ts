import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgwWowModule } from 'ngx-wow';

import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './views/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AuthInterceptorService } from './views/pages/auth-interceptor.service';
import { TutorialsComponent } from './views/pages/tutorials/tutorials.component';
import { TutorialListComponent } from './views/pages/tutorials/tutorial-list/tutorial-list.component';
import { ViewtutorialComponent } from './views/pages/tutorials/viewtutorial/viewtutorial.component';
import { AngularCropperjsModule } from 'angular-cropperjs';

@NgModule({
  declarations: [
    AppComponent,
    TutorialsComponent,
    TutorialListComponent,
    ViewtutorialComponent,

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
    NgwWowModule,
    AngularCropperjsModule,
  ],
  providers: [
    DatePipe,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
