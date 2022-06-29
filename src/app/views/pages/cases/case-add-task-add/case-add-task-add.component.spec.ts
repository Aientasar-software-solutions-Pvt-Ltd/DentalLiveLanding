import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAddTaskAddComponent } from './case-add-task-add.component';

describe('CaseAddTaskAddComponent', () => {
  let component: CaseAddTaskAddComponent;
  let fixture: ComponentFixture<CaseAddTaskAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseAddTaskAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAddTaskAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
