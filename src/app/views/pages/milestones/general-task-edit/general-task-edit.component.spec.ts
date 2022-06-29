import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTaskEditComponent } from './general-task-edit.component';

describe('GeneralTaskEditComponent', () => {
  let component: GeneralTaskEditComponent;
  let fixture: ComponentFixture<GeneralTaskEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTaskEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
