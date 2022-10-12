import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalliveTalkComponent } from './dentallive-talk.component';

describe('DentalliveTalkComponent', () => {
  let component: DentalliveTalkComponent;
  let fixture: ComponentFixture<DentalliveTalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalliveTalkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalliveTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
