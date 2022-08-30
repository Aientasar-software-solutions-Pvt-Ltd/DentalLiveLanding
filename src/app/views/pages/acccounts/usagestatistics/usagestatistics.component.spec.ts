import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsagestatisticsComponent } from './usagestatistics.component';

describe('UsagestatisticsComponent', () => {
  let component: UsagestatisticsComponent;
  let fixture: ComponentFixture<UsagestatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsagestatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsagestatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
