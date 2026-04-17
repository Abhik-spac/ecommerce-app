import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, ToastService } from '@ecommerce/shared';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);
  isSaving = signal(false);
  savedAddresses = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      });
    }

    this.loadSavedAddresses();
  }

  currentUser() {
    return this.authService.currentUser();
  }

  getCurrentDate() {
    return new Date();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.isSaving.set(false);
        this.toastService.success('Profile updated successfully!');
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isSaving.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.isSaving.set(false);
        this.passwordForm.reset();
        this.toastService.success('Password changed successfully!');
      }, 1000);
    }
  }

  loadSavedAddresses(): void {
    // Load from localStorage or API
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      this.savedAddresses.set(JSON.parse(saved));
    }
  }

  addNewAddress(): void {
    this.toastService.info('Add address feature coming soon!');
  }

  editAddress(address: any): void {
    this.toastService.info('Edit address feature coming soon!');
  }

  deleteAddress(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.savedAddresses.update(addresses =>
        addresses.filter(addr => addr.id !== addressId)
      );
      localStorage.setItem('savedAddresses', JSON.stringify(this.savedAddresses()));
      this.toastService.success('Address deleted successfully!');
    }
  }

  deactivateAccount(): void {
    if (confirm('Are you sure you want to deactivate your account?')) {
      this.toastService.warning('Account deactivation feature coming soon!');
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      this.toastService.warning('Account deletion feature coming soon!');
    }
  }
}

// Made with Bob
