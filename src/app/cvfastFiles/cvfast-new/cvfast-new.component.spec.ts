import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvfastNewComponent } from './cvfast-new.component';

describe('CvfastNewComponent', () => {
  let component: CvfastNewComponent;
  let fixture: ComponentFixture<CvfastNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvfastNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvfastNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
