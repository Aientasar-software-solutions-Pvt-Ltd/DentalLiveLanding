import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationListsComponent } from './invitation-lists.component';

describe('InvitationListsComponent', () => {
  let component: InvitationListsComponent;
  let fixture: ComponentFixture<InvitationListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
