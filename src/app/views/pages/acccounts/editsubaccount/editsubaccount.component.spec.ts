import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsubaccountComponent } from './editsubaccount.component';

describe('EditsubaccountComponent', () => {
  let component: EditsubaccountComponent;
  let fixture: ComponentFixture<EditsubaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsubaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsubaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
