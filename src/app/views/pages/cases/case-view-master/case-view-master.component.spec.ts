import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseViewMasterComponent } from './case-view-master.component';

describe('CaseViewMasterComponent', () => {
  let component: CaseViewMasterComponent;
  let fixture: ComponentFixture<CaseViewMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseViewMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseViewMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
