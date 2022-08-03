import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralGuideComponent } from './referral-guide.component';

describe('ReferralGuideComponent', () => {
  let component: ReferralGuideComponent;
  let fixture: ComponentFixture<ReferralGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
