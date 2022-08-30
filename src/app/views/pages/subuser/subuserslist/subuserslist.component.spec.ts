import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubuserslistComponent } from './subuserslist.component';

describe('SubuserslistComponent', () => {
  let component: SubuserslistComponent;
  let fixture: ComponentFixture<SubuserslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubuserslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubuserslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
