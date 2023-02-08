import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseThreadsComponent } from './case-threads.component';

describe('CaseThreadsComponent', () => {
  let component: CaseThreadsComponent;
  let fixture: ComponentFixture<CaseThreadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseThreadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseThreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
