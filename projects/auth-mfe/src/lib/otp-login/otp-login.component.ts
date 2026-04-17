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
  selector: 'app-otp-login',
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
  templateUrl: './otp-login.component.html',
  styleUrl: './otp-login.component.scss'
})
export class OTPLoginComponent {
  phoneNumber = '';
  otpDigits = ['', '', '', '', '', ''];
  otpSent = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  remainingTime = signal(60);
  canResend = signal(false);
  
  private resendTimer: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  sendOTP(): void {
    if (!this.phoneNumber) {
      this.errorMessage.set('Please enter a valid phone number');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.sendOTP(this.phoneNumber).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.otpSent.set(true);
        this.startResendTimer();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to send OTP');
      }
    });
  }

  verifyOTP(): void {
    const otp = this.otpDigits.join('');
    
    if (otp.length !== 6) {
      this.errorMessage.set('Please enter complete OTP');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.verifyOTP(this.phoneNumber, otp).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Invalid OTP');
        this.otpDigits = ['', '', '', '', '', ''];
      }
    });
  }

  resendOTP(): void {
    this.otpDigits = ['', '', '', '', '', ''];
    this.errorMessage.set('');
    this.sendOTP();
  }

  onOTPInput(event: any, index: number): void {
    const value = event.target.value;
    
    if (value && index < 5) {
      const nextInput = event.target.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onOTPKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = (event.target as HTMLElement).previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  isOTPComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  private startResendTimer(): void {
    this.remainingTime.set(60);
    this.canResend.set(false);

    this.resendTimer = setInterval(() => {
      const time = this.remainingTime() - 1;
      this.remainingTime.set(time);

      if (time <= 0) {
        this.canResend.set(true);
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  }
}

// Made with Bob
