import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneAddComponent } from './milestone-add.component';

describe('MilestoneAddComponent', () => {
  let component: MilestoneAddComponent;
  let fixture: ComponentFixture<MilestoneAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
