import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleagueListComponent } from './colleague-list.component';

describe('ColleagueListComponent', () => {
  let component: ColleagueListComponent;
  let fixture: ComponentFixture<ColleagueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColleagueListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColleagueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
