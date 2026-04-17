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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@ecommerce/shared';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'app-register',
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
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formData: RegisterForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register({
      email: this.formData.email,
      password: this.formData.password,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      phone: this.formData.phone
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Registration failed');
      }
    });
  }

  socialLogin(provider: 'google' | 'facebook'): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.socialLogin(provider, 'mock-token-' + provider).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Social login failed');
      }
    });
  }

  passwordsMatch(): boolean {
    return this.formData.password === this.formData.confirmPassword;
  }

  passwordStrength(): number {
    const password = this.formData.password;
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

  isFormValid(): boolean {
    return !!(
      this.formData.firstName &&
      this.formData.lastName &&
      this.formData.email &&
      this.formData.password &&
      this.formData.confirmPassword &&
      this.passwordsMatch() &&
      this.formData.acceptTerms &&
      this.passwordStrength() >= 40
    );
  }
}

// Made with Bob
