import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalliveMailComponent } from './dentallive-mail.component';

describe('DentalliveMailComponent', () => {
  let component: DentalliveMailComponent;
  let fixture: ComponentFixture<DentalliveMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalliveMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalliveMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
