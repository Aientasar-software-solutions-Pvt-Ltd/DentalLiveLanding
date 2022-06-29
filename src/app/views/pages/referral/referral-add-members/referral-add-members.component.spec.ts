import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralAddMembersComponent } from './referral-add-members.component';

describe('ReferralAddMembersComponent', () => {
  let component: ReferralAddMembersComponent;
  let fixture: ComponentFixture<ReferralAddMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralAddMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralAddMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
