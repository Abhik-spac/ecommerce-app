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
import { CartService, AuthService } from '@ecommerce/shared';

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
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
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

    // Add dynamic validation based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.updatePaymentValidation(method);
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

    // Set initial validation
    this.updatePaymentValidation('card');
  }

  updatePaymentValidation(method: string): void {
    const cardNumber = this.paymentForm.get('cardNumber');
    const cardName = this.paymentForm.get('cardName');
    const cardExpiry = this.paymentForm.get('cardExpiry');
    const cardCvv = this.paymentForm.get('cardCvv');
    const upiId = this.paymentForm.get('upiId');

    // Clear all validators first
    cardNumber?.clearValidators();
    cardName?.clearValidators();
    cardExpiry?.clearValidators();
    cardCvv?.clearValidators();
    upiId?.clearValidators();

    // Add validators based on payment method
    if (method === 'card') {
      cardNumber?.setValidators([Validators.required, Validators.minLength(16)]);
      cardName?.setValidators(Validators.required);
      cardExpiry?.setValidators([Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]);
      cardCvv?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
    } else if (method === 'upi') {
      upiId?.setValidators([Validators.required, Validators.pattern(/^[\w.-]+@[\w.-]+$/)]);
    }

    // Update validity
    cardNumber?.updateValueAndValidity();
    cardName?.updateValueAndValidity();
    cardExpiry?.updateValueAndValidity();
    cardCvv?.updateValueAndValidity();
    upiId?.updateValueAndValidity();
  }

  cancelCheckout(): void {
    this.router.navigate(['/cart']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
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

  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
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
