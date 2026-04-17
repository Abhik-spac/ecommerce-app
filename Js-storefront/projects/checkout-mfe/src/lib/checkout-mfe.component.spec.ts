import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutMfeComponent } from './checkout-mfe.component';

describe('CheckoutMfeComponent', () => {
  let component: CheckoutMfeComponent;
  let fixture: ComponentFixture<CheckoutMfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutMfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutMfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
