import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCaseListComponent } from './patient-case-list.component';

describe('PatientCaseListComponent', () => {
  let component: PatientCaseListComponent;
  let fixture: ComponentFixture<PatientCaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
