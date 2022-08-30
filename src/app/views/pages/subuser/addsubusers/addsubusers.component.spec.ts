import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsubusersComponent } from './addsubusers.component';

describe('AddsubusersComponent', () => {
  let component: AddsubusersComponent;
  let fixture: ComponentFixture<AddsubusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsubusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsubusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
