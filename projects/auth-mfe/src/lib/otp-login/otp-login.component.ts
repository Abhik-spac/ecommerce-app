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
  template: `
    <div class="otp-login-container">
      <mat-card class="otp-card">
        <mat-card-header>
          <h1>Login with OTP</h1>
          <p>Enter your mobile number to receive OTP</p>
        </mat-card-header>

        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Enter Phone Number -->
            <mat-step [completed]="otpSent()">
              <ng-template matStepLabel>Enter Phone Number</ng-template>
              
              <form (ngSubmit)="sendOTP()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Mobile Number</mat-label>
                  <input matInput type="tel" [(ngModel)]="phoneNumber" 
                         name="phone" placeholder="+91 9876543210" required>
                  <mat-icon matPrefix>phone</mat-icon>
                </mat-form-field>

                <div *ngIf="errorMessage()" class="error-message">
                  <mat-icon>error</mat-icon>
                  {{ errorMessage() }}
                </div>

                <div class="button-group">
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="isLoading() || !phoneNumber">
                    <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
                    <span *ngIf="!isLoading()">Send OTP</span>
                  </button>
                  <button mat-button routerLink="/login" type="button">
                    Back to Login
                  </button>
                </div>
              </form>

              <div *ngIf="otpSent()" class="success-message">
                <mat-icon>check_circle</mat-icon>
                <p>OTP sent to {{ phoneNumber }}</p>
                <p class="otp-hint">Check console for OTP (Demo mode)</p>
              </div>
            </mat-step>

            <!-- Step 2: Enter OTP -->
            <mat-step>
              <ng-template matStepLabel>Verify OTP</ng-template>
              
              <form (ngSubmit)="verifyOTP()">
                <div class="otp-info">
                  <p>Enter the 6-digit OTP sent to</p>
                  <p class="phone-display">{{ phoneNumber }}</p>
                </div>

                <div class="otp-input-container">
                  <input *ngFor="let digit of otpDigits; let i = index"
                         #otpInput
                         type="text"
                         maxlength="1"
                         class="otp-digit"
                         [(ngModel)]="otpDigits[i]"
                         [name]="'otp' + i"
                         (input)="onOTPInput($event, i)"
                         (keydown)="onOTPKeyDown($event, i)">
                </div>

                <div *ngIf="errorMessage()" class="error-message">
                  <mat-icon>error</mat-icon>
                  {{ errorMessage() }}
                </div>

                <div class="button-group">
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="isLoading() || !isOTPComplete()">
                    <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
                    <span *ngIf="!isLoading()">Verify & Login</span>
                  </button>
                </div>

                <div class="resend-section">
                  <p *ngIf="!canResend()">
                    Resend OTP in {{ remainingTime() }}s
                  </p>
                  <button mat-button color="primary" type="button"
                          *ngIf="canResend()"
                          (click)="resendOTP()">
                    Resend OTP
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .otp-login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px - 200px);
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .otp-card {
      width: 100%;
      max-width: 500px;

      mat-card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 24px 0;

        h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 500;
        }

        p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }
      }

      mat-card-content {
        padding: 24px;

        form {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .full-width {
            width: 100%;
          }

          .error-message {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: #ffebee;
            color: #c62828;
            border-radius: 4px;
            font-size: 14px;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
            }
          }

          .button-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;

            button[mat-raised-button] {
              height: 48px;
              font-size: 16px;

              mat-spinner {
                display: inline-block;
                margin: 0 auto;
              }
            }
          }
        }

        .success-message {
          margin-top: 16px;
          padding: 16px;
          background: #e8f5e9;
          border-radius: 4px;
          text-align: center;

          mat-icon {
            color: #4caf50;
            font-size: 48px;
            width: 48px;
            height: 48px;
            margin-bottom: 8px;
          }

          p {
            margin: 4px 0;
            color: #2e7d32;
            font-weight: 500;
          }

          .otp-hint {
            font-size: 12px;
            color: #666;
            font-weight: normal;
          }
        }

        .otp-info {
          text-align: center;
          margin-bottom: 24px;

          p {
            margin: 4px 0;
            color: #666;
          }

          .phone-display {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }
        }

        .otp-input-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 24px 0;

          .otp-digit {
            width: 50px;
            height: 60px;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 8px;
            outline: none;
            transition: all 0.2s;

            &:focus {
              border-color: #1976d2;
              box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
            }

            &:not(:placeholder-shown) {
              border-color: #4caf50;
            }
          }
        }

        .resend-section {
          text-align: center;
          margin-top: 16px;

          p {
            color: #666;
            font-size: 14px;
          }
        }
      }
    }

    ::ng-deep .mat-stepper-horizontal {
      margin-top: 24px;
    }
  `]
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
