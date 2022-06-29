import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralInvitationListComponent } from './referral-invitation-list.component';

describe('ReferralInvitationListComponent', () => {
  let component: ReferralInvitationListComponent;
  let fixture: ComponentFixture<ReferralInvitationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralInvitationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralInvitationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
