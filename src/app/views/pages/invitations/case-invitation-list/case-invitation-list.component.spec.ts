import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseInvitationListComponent } from './case-invitation-list.component';

describe('CaseInvitationListComponent', () => {
  let component: CaseInvitationListComponent;
  let fixture: ComponentFixture<CaseInvitationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseInvitationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseInvitationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
