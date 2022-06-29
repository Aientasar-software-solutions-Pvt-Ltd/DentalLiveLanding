import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpasswordComponent } from './subpassword.component';

describe('SubpasswordComponent', () => {
  let component: SubpasswordComponent;
  let fixture: ComponentFixture<SubpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
