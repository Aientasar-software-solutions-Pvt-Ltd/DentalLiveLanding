import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseMessageComponent } from './case-message.component';

describe('CaseMessageComponent', () => {
  let component: CaseMessageComponent;
  let fixture: ComponentFixture<CaseMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
