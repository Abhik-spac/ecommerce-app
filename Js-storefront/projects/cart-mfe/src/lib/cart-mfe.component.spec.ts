import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartMfeComponent } from './cart-mfe.component';

describe('CartMfeComponent', () => {
  let component: CartMfeComponent;
  let fixture: ComponentFixture<CartMfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartMfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartMfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
