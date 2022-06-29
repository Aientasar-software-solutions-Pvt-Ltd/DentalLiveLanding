import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTaskAddComponent } from './general-task-add.component';

describe('GeneralTaskAddComponent', () => {
  let component: GeneralTaskAddComponent;
  let fixture: ComponentFixture<GeneralTaskAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTaskAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTaskAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
