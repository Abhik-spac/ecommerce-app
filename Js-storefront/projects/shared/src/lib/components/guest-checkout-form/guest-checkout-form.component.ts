import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface GuestCheckoutData {
  name: string;
  email: string;
  mobile: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

@Component({
  selector: 'lib-guest-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guest-checkout-form.component.html',
  styleUrls: ['./guest-checkout-form.component.scss']
})
export class GuestCheckoutFormComponent {
  @Output() formSubmit = new EventEmitter<GuestCheckoutData>();
  @Output() cancel = new EventEmitter<void>();

  checkoutForm: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', [Validators.required, Validators.minLength(2)]],
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        country: ['India', Validators.required]
      })
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.isSubmitting.set(true);
      this.formSubmit.emit(this.checkoutForm.value);
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.checkoutForm.get(fieldName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['pattern']) {
      if (fieldName === 'mobile') {
        return 'Mobile number must be 10 digits';
      }
      if (fieldName === 'address.pincode') {
        return 'Pincode must be 6 digits';
      }
    }
    if (control.errors['minLength']) {
      return `${this.getFieldLabel(fieldName)} is too short`;
    }

    return 'Invalid input';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Name',
      'email': 'Email',
      'mobile': 'Mobile',
      'address.street': 'Street Address',
      'address.city': 'City',
      'address.state': 'State',
      'address.pincode': 'Pincode',
      'address.country': 'Country'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.checkoutForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}

// Made with Bob
