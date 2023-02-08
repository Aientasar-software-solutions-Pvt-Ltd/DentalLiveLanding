import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneDetailMasterComponent } from './milestone-detail-master.component';

describe('MilestoneDetailMasterComponent', () => {
  let component: MilestoneDetailMasterComponent;
  let fixture: ComponentFixture<MilestoneDetailMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneDetailMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneDetailMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
