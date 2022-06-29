import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAddFileUploadComponent } from './case-add-file-upload.component';

describe('CaseAddFileUploadComponent', () => {
  let component: CaseAddFileUploadComponent;
  let fixture: ComponentFixture<CaseAddFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseAddFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAddFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
