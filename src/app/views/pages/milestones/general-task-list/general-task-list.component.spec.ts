import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTaskListComponent } from './general-task-list.component';

describe('GeneralTaskListComponent', () => {
  let component: GeneralTaskListComponent;
  let fixture: ComponentFixture<GeneralTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
