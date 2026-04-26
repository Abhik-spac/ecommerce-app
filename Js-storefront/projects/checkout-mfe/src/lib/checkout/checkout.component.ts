import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CartService, AuthService, ToastService } from '@ecommerce/shared';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environment';
import { firstValueFrom } from 'rxjs';

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
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  isProcessing = signal(false);
  isGuest = signal(false);
  savedAddresses = signal<any[]>([]);
  selectedAddressId = signal<string | null>(null);
  checkoutSessionId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
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
      paymentMethod: ['', Validators.required],
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

    // Add listener to sanitize phone number input
    this.shippingForm.get('phone')?.valueChanges.subscribe(value => {
      if (value) {
        const sanitized = this.sanitizePhoneNumber(value);
        if (sanitized !== value) {
          this.shippingForm.get('phone')?.setValue(sanitized, { emitEvent: false });
        }
      }
    });
  }

  private sanitizePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Remove country codes and leading zeros
    // Keep removing leading 0s
    while (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // If starts with 91 and has more than 10 digits, remove 91
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    }
    
    // Remove any remaining leading zeros after country code removal
    while (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Limit to 10 digits
    return cleaned.substring(0, 10);
  }

  async ngOnInit(): Promise<void> {
    // Check if user is guest
    this.isGuest.set(this.authService.isGuestUser());

    // Redirect if cart is empty
    if (this.cartService.itemCount() === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    // Load saved addresses for logged-in users
    if (!this.isGuest()) {
      await this.loadSavedAddresses();
    }

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

    // Try to restore checkout session
    await this.restoreCheckoutSession();
  }

  async loadSavedAddresses(): Promise<void> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${environment.apiUrls.user}/users/addresses`)
      );
      if (response.success && response.data) {
        this.savedAddresses.set(response.data);
      }
    } catch (error) {
      // Failed to load saved addresses - silently fail
    }
  }

  onAddressSelect(addressId: string): void {
    const address = this.savedAddresses().find(addr => addr._id === addressId);
    if (address) {
      this.shippingForm.patchValue({
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        address1: address.address1,
        address2: address.address2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country
      });
      this.selectedAddressId.set(addressId);
      this.toastService.success('Address loaded successfully');
    }
  }

  async saveShippingAddress(): Promise<void> {
    if (!this.shippingForm.valid) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    const hasChanged = this.shippingForm.dirty;
    
    // Persist address if requested
    await this.persistAddress();

    // Move to next step
    this.stepper.next();

    // Save checkout session with updated step
    const sessionSaved = await this.saveCheckoutSession();
    if (!sessionSaved) {
      this.toastService.error('Failed to save checkout progress');
    }

    // Mark form as pristine after successful save
    if (hasChanged) {
      this.shippingForm.markAsPristine();
      this.toastService.success('Shipping address confirmed');
    } else {
      this.toastService.info('Moving to next step');
    }
  }

  private async persistAddress(): Promise<boolean> {
    if (!this.shippingForm.value.saveAddress || this.isGuest()) {
      return true;
    }

    try {
      const addressData = this.buildAddressPayload(true);
      const response: any = await firstValueFrom(
        this.http.post(`${environment.apiUrls.user}/users/addresses`, addressData)
      );
      
      if (response.success) {
        this.toastService.success('Address saved successfully');
        await this.loadSavedAddresses();
        return true;
      }
      return false;
    } catch (error) {
      this.toastService.error('Failed to save address');
      return false;
    }
  }

  private buildAddressPayload(includeDefaults = false): any {
    const formValue = this.shippingForm.value;
    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      address1: formValue.address1,
      address2: formValue.address2,
      city: formValue.city,
      state: formValue.state,
      postalCode: formValue.postalCode,
      country: formValue.country,
      ...(includeDefaults && { isDefault: this.savedAddresses().length === 0 })
    };
  }

  async savePaymentMethod(): Promise<void> {
    if (!this.paymentForm.valid) {
      this.toastService.error('Please fill in all required payment details');
      return;
    }

    const hasChanged = this.paymentForm.dirty;
    
    // Move to next step
    this.stepper.next();

    // Save checkout session with updated step
    const sessionSaved = await this.saveCheckoutSession();
    if (!sessionSaved) {
      this.toastService.error('Failed to save checkout progress');
    }

    // Mark form as pristine after successful save
    this.paymentForm.markAsPristine();
    
    if (hasChanged) {
      this.toastService.success('Payment method confirmed');
    } else {
      this.toastService.info('Moving to next step');
    }
  }

  async saveCheckoutSession(): Promise<boolean> {
    try {
      const shippingAddress = { ...this.shippingForm.value };
      // Sanitize phone number before sending
      if (shippingAddress.phone) {
        shippingAddress.phone = this.sanitizePhoneNumber(shippingAddress.phone);
      }

      const sessionData = {
        shippingAddress,
        paymentMethod: this.paymentForm.value.paymentMethod,
        currentStep: this.stepper?.selectedIndex || 0,
        cartSnapshot: this.cartService.items(),
        totalAmount: this.cartService.total()
      };

      // Always use POST - backend handles create/update logic
      const url = `${environment.apiUrls.checkout}/checkout/session`;
      const response: any = await firstValueFrom(
        this.http.post(url, sessionData)
      );

      if (response.success && response.data) {
        this.checkoutSessionId.set(response.data._id);
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.error?.message) {
        this.toastService.error(error.error.message);
      }
      return false;
    }
  }

  async restoreCheckoutSession(): Promise<void> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${environment.apiUrls.checkout}/checkout/session`)
      );
      
      if (response.success && response.data) {
        const session = response.data;
        this.checkoutSessionId.set(session._id);

        // Restore shipping address
        if (session.shippingAddress) {
          this.shippingForm.patchValue(session.shippingAddress);
        }

        // Restore payment method
        if (session.paymentMethod) {
          this.paymentForm.patchValue({ paymentMethod: session.paymentMethod });
          // Update validators based on restored payment method
          this.updatePaymentValidation(session.paymentMethod);
          // Force form validation update
          this.paymentForm.updateValueAndValidity();
        }
        
        // Mark forms as pristine after restoration
        this.shippingForm.markAsPristine();
        this.paymentForm.markAsPristine();

        // Restore stepper position
        if (session.currentStep && this.stepper) {
          setTimeout(() => {
            this.stepper.selectedIndex = session.currentStep;
          }, 100);
        }

        this.toastService.info('Previous checkout session restored');
      }
    } catch (error) {
      // No existing session, that's fine
      console.log('No existing checkout session');
    }
  }

  isShippingFormValid(): boolean {
    return this.shippingForm.valid;
  }

  isPaymentFormValid(): boolean {
    const paymentMethod = this.paymentForm.get('paymentMethod')?.value;
    
    if (!paymentMethod) {
      return false;
    }

    // Check validation based on selected payment method
    if (paymentMethod === 'card') {
      const cardNumber = this.paymentForm.get('cardNumber');
      const cardName = this.paymentForm.get('cardName');
      const cardExpiry = this.paymentForm.get('cardExpiry');
      const cardCvv = this.paymentForm.get('cardCvv');
      return !!(cardNumber?.valid && cardName?.valid && cardExpiry?.valid && cardCvv?.valid);
    } else if (paymentMethod === 'upi') {
      const upiId = this.paymentForm.get('upiId');
      return !!upiId?.valid;
    } else if (paymentMethod === 'netbanking' || paymentMethod === 'cod') {
      // For netbanking and COD, no additional fields required
      return true;
    }

    return false;
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

  async placeOrder(): Promise<void> {
    this.isProcessing.set(true);

    try {
      const shippingAddress = { ...this.shippingForm.value };
      // Sanitize phone number before sending
      if (shippingAddress.phone) {
        shippingAddress.phone = this.sanitizePhoneNumber(shippingAddress.phone);
      }

      const orderData = {
        shippingAddress,
        paymentMethod: this.paymentForm.value.paymentMethod,
        items: this.cartService.items(),
        subtotal: this.cartService.subtotal(),
        tax: this.cartService.tax(),
        total: this.cartService.total()
      };

      console.log('Placing order with data:', orderData);

      const response: any = await firstValueFrom(
        this.http.post(`${environment.apiUrls.order}/orders`, orderData)
      );

      if (response && response.success && response.data) {

        // Step 1: Clear checkout session
        try {
          await firstValueFrom(
            this.http.delete(`${environment.apiUrls.checkout}/checkout/session`)
          );
          console.log('Checkout session deleted');
        } catch (deleteError) {
          // Ignore delete errors - session will expire naturally
          console.log('Could not delete checkout session:', deleteError);
        }

        // Step 2: Clear cart after successful order
        console.log('Clearing cart...');
        this.cartService.clearCart();
        console.log('Cart cleared');

        // Step 3: Show success message
        this.toastService.success('Order placed successfully!');
        
        // Step 4: Navigate to order confirmation with state to verify legitimate access
        const orderId = response.data._id || response.data.id;
        console.log('Navigating to order:', orderId);
        await this.router.navigate(['/orders', orderId], {
          state: { fromCheckout: true, orderData: response.data }
        });
        console.log('Navigation complete');
      } else {
        console.error('Order response missing success or data:', response);
        this.toastService.error('Failed to place order. Please try again.');
      }
    } catch (error: any) {
      console.error('Order placement failed:', error);
      this.toastService.error(error.error?.message || 'Failed to place order. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }
}

// Made with Bob
