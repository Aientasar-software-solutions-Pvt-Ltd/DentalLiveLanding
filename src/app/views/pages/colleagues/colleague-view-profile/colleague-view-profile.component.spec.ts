import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleagueViewProfileComponent } from './colleague-view-profile.component';

describe('ColleagueViewProfileComponent', () => {
  let component: ColleagueViewProfileComponent;
  let fixture: ComponentFixture<ColleagueViewProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColleagueViewProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColleagueViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
