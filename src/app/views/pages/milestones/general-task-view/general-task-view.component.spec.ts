import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTaskViewComponent } from './general-task-view.component';

describe('GeneralTaskViewComponent', () => {
  let component: GeneralTaskViewComponent;
  let fixture: ComponentFixture<GeneralTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTaskViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
