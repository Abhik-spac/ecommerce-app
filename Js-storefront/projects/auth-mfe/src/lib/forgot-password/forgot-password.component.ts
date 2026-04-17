import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '@ecommerce/shared';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  resetToken = '';
  newPassword = '';
  confirmPassword = '';
  
  emailSent = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  sendResetEmail(): void {
    if (!this.email) {
      this.errorMessage.set('Please enter a valid email address');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.emailSent.set(true);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to send reset email');
      }
    });
  }

  resetPassword(): void {
    if (!this.isResetFormValid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.resetPassword(this.resetToken, this.newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Stepper will automatically move to next step
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to reset password');
      }
    });
  }

  resendResetEmail(): void {
    this.resetToken = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage.set('');
    this.sendResetEmail();
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  passwordStrength(): number {
    const password = this.newPassword;
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;

    return strength;
  }

  getStrengthLevel(): string {
    const strength = this.passwordStrength();
    if (strength < 40) return 'weak';
    if (strength < 70) return 'medium';
    return 'strong';
  }

  getStrengthText(): string {
    const level = this.getStrengthLevel();
    return level.charAt(0).toUpperCase() + level.slice(1) + ' password';
  }

  isResetFormValid(): boolean {
    return !!(
      this.resetToken &&
      this.newPassword &&
      this.confirmPassword &&
      this.passwordsMatch() &&
      this.passwordStrength() >= 40
    );
  }
}

// Made with Bob
