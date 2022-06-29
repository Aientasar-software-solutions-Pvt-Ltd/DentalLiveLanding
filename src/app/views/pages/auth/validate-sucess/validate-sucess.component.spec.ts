import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateSucessComponent } from './validate-sucess.component';

describe('ValidateSucessComponent', () => {
  let component: ValidateSucessComponent;
  let fixture: ComponentFixture<ValidateSucessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateSucessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateSucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
