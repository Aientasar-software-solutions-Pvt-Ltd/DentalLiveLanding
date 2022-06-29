import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneAddMembersComponent } from './milestone-add-members.component';

describe('MilestoneAddMembersComponent', () => {
  let component: MilestoneAddMembersComponent;
  let fixture: ComponentFixture<MilestoneAddMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneAddMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneAddMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
