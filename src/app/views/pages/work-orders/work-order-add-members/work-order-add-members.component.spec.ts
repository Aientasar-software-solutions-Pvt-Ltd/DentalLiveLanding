import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAddMembersComponent } from './work-order-add-members.component';

describe('WorkOrderAddMembersComponent', () => {
  let component: WorkOrderAddMembersComponent;
  let fixture: ComponentFixture<WorkOrderAddMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderAddMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderAddMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
