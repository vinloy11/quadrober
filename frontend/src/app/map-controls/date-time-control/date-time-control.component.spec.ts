import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeControlComponent } from './date-time-control.component';

describe('DateTimeControlComponent', () => {
  let component: DateTimeControlComponent;
  let fixture: ComponentFixture<DateTimeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateTimeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
