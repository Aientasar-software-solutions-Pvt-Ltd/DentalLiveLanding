import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPlannerComponentComponent } from './dental-planner-component.component';

describe('DentalPlannerComponentComponent', () => {
  let component: DentalPlannerComponentComponent;
  let fixture: ComponentFixture<DentalPlannerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalPlannerComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalPlannerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
