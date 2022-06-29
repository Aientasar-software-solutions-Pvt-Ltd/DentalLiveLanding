import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cvfast } from './cvfast.component';

describe('Cvfast', () => {
  let component: Cvfast;
  let fixture: ComponentFixture<Cvfast>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Cvfast]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cvfast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
