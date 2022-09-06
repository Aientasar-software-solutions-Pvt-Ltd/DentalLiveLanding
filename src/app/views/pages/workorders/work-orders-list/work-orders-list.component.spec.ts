import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersListComponent } from './work-orders-list.component';

describe('WorkOrdersListComponent', () => {
  let component: WorkOrdersListComponent;
  let fixture: ComponentFixture<WorkOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrdersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
