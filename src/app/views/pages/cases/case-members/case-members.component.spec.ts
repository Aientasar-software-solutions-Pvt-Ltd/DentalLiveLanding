import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseMembersComponent } from './case-members.component';

describe('CaseMembersComponent', () => {
  let component: CaseMembersComponent;
  let fixture: ComponentFixture<CaseMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
