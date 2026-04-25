import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@ecommerce/shared';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
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
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]*$/)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password strength
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const strength = this.calculatePasswordStrength(password);
    return strength >= 40 ? null : { weakPassword: true };
  }

  // Custom validator for password match
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Extract password only at submission time - never store in component state
    const { password, confirmPassword, ...userData } = this.registerForm.value;

    this.authService.register({
      ...userData,
      password // Only pass to API, immediately discarded after this line
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Clear all form data including passwords immediately
        this.registerForm.reset();
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        this.router.navigateByUrl(returnUrl || '/products');
      },
      error: (error) => {
        console.log('ERROR', error);
        this.isLoading.set(false);
        // Clear password fields on error for security
        this.registerForm.patchValue({
          password: '',
          confirmPassword: ''
        });
        this.errorMessage.set(error.error?.error || 'Registration failed');
      }
    });
  }

  socialLogin(provider: 'google' | 'facebook'): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    // Social login not implemented yet
    this.isLoading.set(false);
    this.errorMessage.set('Social login coming soon!');
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  passwordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    return this.calculatePasswordStrength(password);
  }

  private calculatePasswordStrength(password: string): number {
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

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  ngOnDestroy(): void {
    // Clear all form data when component is destroyed
    this.registerForm.reset();
  }
}

// Made with Bob
