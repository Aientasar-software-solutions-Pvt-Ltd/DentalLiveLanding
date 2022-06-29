import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderInvitationListComponent } from './work-order-invitation-list.component';

describe('WorkOrderInvitationListComponent', () => {
  let component: WorkOrderInvitationListComponent;
  let fixture: ComponentFixture<WorkOrderInvitationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderInvitationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderInvitationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
