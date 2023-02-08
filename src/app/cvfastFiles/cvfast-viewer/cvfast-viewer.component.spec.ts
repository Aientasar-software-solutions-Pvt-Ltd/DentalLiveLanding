import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvfastViewerComponent } from './cvfast-viewer.component';

describe('CvfastViewerComponent', () => {
  let component: CvfastViewerComponent;
  let fixture: ComponentFixture<CvfastViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvfastViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvfastViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
