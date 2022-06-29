import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetsubpaswordComponent } from './forgetsubpasword.component';

describe('ForgetsubpaswordComponent', () => {
  let component: ForgetsubpaswordComponent;
  let fixture: ComponentFixture<ForgetsubpaswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetsubpaswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetsubpaswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
