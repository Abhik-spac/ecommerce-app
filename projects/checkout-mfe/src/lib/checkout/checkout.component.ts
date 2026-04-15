import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '@ecommerce/shared';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="checkout-container">
      <div class="checkout-content">
        <h1>Checkout</h1>

        <mat-stepper [linear]="true" #stepper>
          <!-- Step 1: Shipping Address -->
          <mat-step [stepControl]="shippingForm">
            <form [formGroup]="shippingForm">
              <ng-template matStepLabel>Shipping Address</ng-template>
              
              <mat-card>
                <mat-card-content>
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>First Name</mat-label>
                      <input matInput formControlName="firstName" required>
                      <mat-icon matPrefix>person</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Last Name</mat-label>
                      <input matInput formControlName="lastName" required>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" required>
                    <mat-icon matPrefix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Phone Number</mat-label>
                    <input matInput type="tel" formControlName="phone" required>
                    <mat-icon matPrefix>phone</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address Line 1</mat-label>
                    <input matInput formControlName="address1" required>
                    <mat-icon matPrefix>home</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address Line 2 (Optional)</mat-label>
                    <input matInput formControlName="address2">
                  </mat-form-field>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>City</mat-label>
                      <input matInput formControlName="city" required>
                      <mat-icon matPrefix>location_city</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>State</mat-label>
                      <input matInput formControlName="state" required>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Postal Code</mat-label>
                      <input matInput formControlName="postalCode" required>
                      <mat-icon matPrefix>markunread_mailbox</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Country</mat-label>
                      <input matInput formControlName="country" required>
                    </mat-form-field>
                  </div>

                  <mat-checkbox formControlName="saveAddress">
                    Save this address for future orders
                  </mat-checkbox>
                </mat-card-content>
              </mat-card>

              <div class="step-actions">
                <button mat-raised-button color="primary" matStepperNext
                        [disabled]="!shippingForm.valid">
                  Continue to Payment
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 2: Payment Method -->
          <mat-step [stepControl]="paymentForm">
            <form [formGroup]="paymentForm">
              <ng-template matStepLabel>Payment Method</ng-template>
              
              <mat-card>
                <mat-card-content>
                  <mat-radio-group formControlName="paymentMethod" class="payment-methods">
                    <mat-radio-button value="card">
                      <div class="payment-option">
                        <mat-icon>credit_card</mat-icon>
                        <span>Credit/Debit Card</span>
                      </div>
                    </mat-radio-button>

                    <mat-radio-button value="upi">
                      <div class="payment-option">
                        <mat-icon>qr_code</mat-icon>
                        <span>UPI</span>
                      </div>
                    </mat-radio-button>

                    <mat-radio-button value="netbanking">
                      <div class="payment-option">
                        <mat-icon>account_balance</mat-icon>
                        <span>Net Banking</span>
                      </div>
                    </mat-radio-button>

                    <mat-radio-button value="cod">
                      <div class="payment-option">
                        <mat-icon>local_shipping</mat-icon>
                        <span>Cash on Delivery</span>
                      </div>
                    </mat-radio-button>
                  </mat-radio-group>

                  <!-- Card Details (shown when card is selected) -->
                  <div *ngIf="paymentForm.get('paymentMethod')?.value === 'card'" class="card-details">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Card Number</mat-label>
                      <input matInput formControlName="cardNumber" placeholder="1234 5678 9012 3456">
                      <mat-icon matPrefix>credit_card</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Cardholder Name</mat-label>
                      <input matInput formControlName="cardName">
                      <mat-icon matPrefix>person</mat-icon>
                    </mat-form-field>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Expiry Date</mat-label>
                        <input matInput formControlName="cardExpiry" placeholder="MM/YY">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>CVV</mat-label>
                        <input matInput type="password" formControlName="cardCvv" placeholder="123" maxlength="3">
                      </mat-form-field>
                    </div>
                  </div>

                  <!-- UPI Details -->
                  <div *ngIf="paymentForm.get('paymentMethod')?.value === 'upi'" class="upi-details">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>UPI ID</mat-label>
                      <input matInput formControlName="upiId" placeholder="yourname@upi">
                      <mat-icon matPrefix>qr_code</mat-icon>
                    </mat-form-field>
                  </div>
                </mat-card-content>
              </mat-card>

              <div class="step-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-raised-button color="primary" matStepperNext
                        [disabled]="!paymentForm.valid">
                  Review Order
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Review & Place Order -->
          <mat-step>
            <ng-template matStepLabel>Review Order</ng-template>
            
            <mat-card class="review-card">
              <mat-card-header>
                <h2>Order Summary</h2>
              </mat-card-header>
              <mat-card-content>
                <!-- Cart Items -->
                <div class="order-items">
                  <h3>Items ({{ cartService.itemCount() }})</h3>
                  <div *ngFor="let item of cartService.items()" class="order-item">
                    <img [src]="item.image" [alt]="item.name">
                    <div class="item-details">
                      <h4>{{ item.name }}</h4>
                      <p>Quantity: {{ item.quantity }}</p>
                      <p class="price">₹{{ item.price * item.quantity | number:'1.2-2' }}</p>
                    </div>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <!-- Shipping Address -->
                <div class="review-section">
                  <h3>Shipping Address</h3>
                  <p>{{ shippingForm.value.firstName }} {{ shippingForm.value.lastName }}</p>
                  <p>{{ shippingForm.value.address1 }}</p>
                  <p *ngIf="shippingForm.value.address2">{{ shippingForm.value.address2 }}</p>
                  <p>{{ shippingForm.value.city }}, {{ shippingForm.value.state }} {{ shippingForm.value.postalCode }}</p>
                  <p>{{ shippingForm.value.country }}</p>
                  <p>Phone: {{ shippingForm.value.phone }}</p>
                </div>

                <mat-divider></mat-divider>

                <!-- Payment Method -->
                <div class="review-section">
                  <h3>Payment Method</h3>
                  <p>{{ getPaymentMethodLabel() }}</p>
                </div>

                <mat-divider></mat-divider>

                <!-- Price Summary -->
                <div class="price-summary">
                  <div class="price-row">
                    <span>Subtotal:</span>
                    <span>₹{{ cartService.subtotal() | number:'1.2-2' }}</span>
                  </div>
                  <div class="price-row">
                    <span>Tax (18%):</span>
                    <span>₹{{ cartService.tax() | number:'1.2-2' }}</span>
                  </div>
                  <div class="price-row">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <mat-divider></mat-divider>
                  <div class="price-row total">
                    <span>Total:</span>
                    <span>₹{{ cartService.total() | number:'1.2-2' }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Back</button>
              <button mat-raised-button color="primary" (click)="placeOrder()"
                      [disabled]="isProcessing()">
                <mat-spinner *ngIf="isProcessing()" diameter="20"></mat-spinner>
                <span *ngIf="!isProcessing()">Place Order</span>
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </div>

      <!-- Order Summary Sidebar -->
      <div class="order-summary-sidebar">
        <mat-card>
          <mat-card-header>
            <h3>Order Summary</h3>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-row">
              <span>Items ({{ cartService.itemCount() }}):</span>
              <span>₹{{ cartService.subtotal() | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>₹{{ cartService.tax() | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <mat-divider></mat-divider>
            <div class="summary-row total">
              <span>Total:</span>
              <span>₹{{ cartService.total() | number:'1.2-2' }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 24px;
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;

      @media (max-width: 968px) {
        grid-template-columns: 1fr;
      }
    }

    .checkout-content {
      h1 {
        margin: 0 0 24px 0;
        font-size: 32px;
        font-weight: 500;
      }
    }

    mat-card {
      margin-bottom: 16px;

      mat-card-content {
        padding: 24px;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .full-width {
      width: 100%;
    }

    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;

      mat-radio-button {
        padding: 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
          border-color: #1976d2;
          background: #f5f5f5;
        }

        &.mat-radio-checked {
          border-color: #1976d2;
          background: #e3f2fd;
        }
      }

      .payment-option {
        display: flex;
        align-items: center;
        gap: 12px;

        mat-icon {
          color: #666;
        }

        span {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .card-details, .upi-details {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    .step-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;

      button {
        min-width: 120px;
      }
    }

    .review-card {
      .order-items {
        margin-bottom: 24px;

        h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 500;
        }

        .order-item {
          display: flex;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
          }

          .item-details {
            flex: 1;

            h4 {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 500;
            }

            p {
              margin: 4px 0;
              color: #666;
              font-size: 14px;
            }

            .price {
              color: #1976d2;
              font-weight: 600;
              font-size: 16px;
            }
          }
        }
      }

      .review-section {
        padding: 16px 0;

        h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 500;
        }

        p {
          margin: 4px 0;
          color: #666;
        }
      }

      .price-summary {
        padding: 16px 0;

        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 16px;

          &.total {
            font-size: 20px;
            font-weight: 600;
            color: #1976d2;
            padding-top: 16px;
          }
        }
      }
    }

    .order-summary-sidebar {
      mat-card {
        position: sticky;
        top: 24px;

        h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 16px;

          &.total {
            font-size: 20px;
            font-weight: 600;
            color: #1976d2;
            padding-top: 16px;
          }
        }
      }
    }

    ::ng-deep .mat-stepper-horizontal {
      margin-top: 24px;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  isProcessing = signal(false);

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['India', Validators.required],
      saveAddress: [false]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['card', Validators.required],
      cardNumber: [''],
      cardName: [''],
      cardExpiry: [''],
      cardCvv: [''],
      upiId: ['']
    });
  }

  ngOnInit(): void {
    // Pre-fill user data if logged in
    const user = this.authService.currentUser();
    if (user) {
      this.shippingForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      });
    }

    // Redirect if cart is empty
    if (this.cartService.itemCount() === 0) {
      this.router.navigate(['/cart']);
    }
  }

  getPaymentMethodLabel(): string {
    const method = this.paymentForm.get('paymentMethod')?.value;
    const labels: any = {
      card: 'Credit/Debit Card',
      upi: 'UPI',
      netbanking: 'Net Banking',
      cod: 'Cash on Delivery'
    };
    return labels[method] || method;
  }

  placeOrder(): void {
    this.isProcessing.set(true);

    // Simulate order processing
    setTimeout(() => {
      const orderId = 'ORD' + Date.now();
      
      // Clear cart
      this.cartService.clearCart();
      
      this.isProcessing.set(false);
      
      // Navigate to order confirmation
      this.router.navigate(['/orders', orderId]);
    }, 2000);
  }
}

// Made with Bob
