import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesListComponent } from './milestones-list.component';

describe('MilestonesListComponent', () => {
  let component: MilestonesListComponent;
  let fixture: ComponentFixture<MilestonesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestonesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestonesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
