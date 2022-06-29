import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpasswordresetComponent } from './subpasswordreset.component';

describe('SubpasswordresetComponent', () => {
  let component: SubpasswordresetComponent;
  let fixture: ComponentFixture<SubpasswordresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubpasswordresetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
