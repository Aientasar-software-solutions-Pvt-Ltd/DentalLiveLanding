import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleagueViewInviteComponent } from './colleague-view-invite.component';

describe('ColleagueViewInviteComponent', () => {
  let component: ColleagueViewInviteComponent;
  let fixture: ComponentFixture<ColleagueViewInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColleagueViewInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColleagueViewInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
