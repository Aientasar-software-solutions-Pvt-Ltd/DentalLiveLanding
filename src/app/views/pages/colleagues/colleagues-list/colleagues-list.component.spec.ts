import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColleaguesListComponent } from './colleagues-list.component';

describe('ColleaguesListComponent', () => {
  let component: ColleaguesListComponent;
  let fixture: ComponentFixture<ColleaguesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColleaguesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColleaguesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
