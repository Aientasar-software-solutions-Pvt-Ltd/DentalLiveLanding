import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralEditComponent } from './referral-edit.component';

describe('ReferralEditComponent', () => {
  let component: ReferralEditComponent;
  let fixture: ComponentFixture<ReferralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
