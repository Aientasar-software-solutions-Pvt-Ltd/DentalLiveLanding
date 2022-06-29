import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleaguesAddMembersComponent } from './colleagues-add-members.component';

describe('ColleaguesAddMembersComponent', () => {
  let component: ColleaguesAddMembersComponent;
  let fixture: ComponentFixture<ColleaguesAddMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColleaguesAddMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColleaguesAddMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
