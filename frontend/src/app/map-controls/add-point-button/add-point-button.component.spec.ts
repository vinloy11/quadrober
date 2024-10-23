import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPointButtonComponent } from './add-point-button.component';

describe('AddPointButtonComponent', () => {
  let component: AddPointButtonComponent;
  let fixture: ComponentFixture<AddPointButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPointButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPointButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
