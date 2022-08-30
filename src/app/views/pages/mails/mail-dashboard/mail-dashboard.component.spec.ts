import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailDashboardComponent } from './mail-dashboard.component';

describe('MailDashboardComponent', () => {
  let component: MailDashboardComponent;
  let fixture: ComponentFixture<MailDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
