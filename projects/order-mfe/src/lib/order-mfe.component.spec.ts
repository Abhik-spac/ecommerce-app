import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMfeComponent } from './order-mfe.component';

describe('OrderMfeComponent', () => {
  let component: OrderMfeComponent;
  let fixture: ComponentFixture<OrderMfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderMfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderMfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
