
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvfastNewComponent } from '../cvfast-new/cvfast-new.component';
import { CvfastViewerComponent } from '../cvfast-viewer/cvfast-viewer.component';
import { FormsModule } from '@angular/forms';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';

@NgModule({
  declarations: [
    CvfastNewComponent,
    CvfastViewerComponent
  ],
  exports: [
    CvfastNewComponent,
    CvfastViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PickerModule,
    NgxShimmerLoadingModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CvfastModuleModule { }
