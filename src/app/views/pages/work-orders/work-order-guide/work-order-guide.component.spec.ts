import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderGuideComponent } from './work-order-guide.component';

describe('WorkOrderGuideComponent', () => {
  let component: WorkOrderGuideComponent;
  let fixture: ComponentFixture<WorkOrderGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
