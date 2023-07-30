import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtutorialComponent } from './viewtutorial.component';

describe('ViewtutorialComponent', () => {
  let component: ViewtutorialComponent;
  let fixture: ComponentFixture<ViewtutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewtutorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
