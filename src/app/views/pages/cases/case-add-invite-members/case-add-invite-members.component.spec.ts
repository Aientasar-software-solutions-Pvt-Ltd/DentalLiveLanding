import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAddInviteMembersComponent } from './case-add-invite-members.component';

describe('CaseAddInviteMembersComponent', () => {
  let component: CaseAddInviteMembersComponent;
  let fixture: ComponentFixture<CaseAddInviteMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseAddInviteMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAddInviteMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
