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
  template: `
    <div class="forgot-password-container">
      <mat-card class="forgot-password-card">
        <mat-card-header>
          <mat-icon class="header-icon">lock_reset</mat-icon>
          <h1>Reset Password</h1>
          <p>Enter your email to receive reset instructions</p>
        </mat-card-header>

        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Enter Email -->
            <mat-step [completed]="emailSent()">
              <ng-template matStepLabel>Enter Email</ng-template>
              
              <form (ngSubmit)="sendResetEmail()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" [(ngModel)]="email" 
                         name="email" placeholder="your@email.com" required>
                  <mat-icon matPrefix>email</mat-icon>
                </mat-form-field>

                <div *ngIf="errorMessage()" class="error-message">
                  <mat-icon>error</mat-icon>
                  {{ errorMessage() }}
                </div>

                <div class="button-group">
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="isLoading() || !email">
                    <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
                    <span *ngIf="!isLoading()">Send Reset Link</span>
                  </button>
                  <button mat-button routerLink="/login" type="button">
                    Back to Login
                  </button>
                </div>
              </form>

              <div *ngIf="emailSent()" class="success-message">
                <mat-icon>check_circle</mat-icon>
                <p>Reset link sent to {{ email }}</p>
                <p class="hint">Check your email for the reset token (Demo mode)</p>
              </div>
            </mat-step>

            <!-- Step 2: Enter Reset Token & New Password -->
            <mat-step>
              <ng-template matStepLabel>Reset Password</ng-template>
              
              <form (ngSubmit)="resetPassword()">
                <div class="reset-info">
                  <p>Enter the reset token from your email</p>
                  <p class="email-display">{{ email }}</p>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Reset Token</mat-label>
                  <input matInput type="text" [(ngModel)]="resetToken" 
                         name="token" placeholder="Enter 6-digit token" required>
                  <mat-icon matPrefix>vpn_key</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>New Password</mat-label>
                  <input matInput [type]="hidePassword() ? 'password' : 'text'" 
                         [(ngModel)]="newPassword" name="password" required>
                  <mat-icon matPrefix>lock</mat-icon>
                  <button mat-icon-button matSuffix type="button"
                          (click)="hidePassword.set(!hidePassword())">
                    <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </mat-form-field>

                <div class="password-strength" *ngIf="newPassword">
                  <div class="strength-bar">
                    <div class="strength-fill" [style.width.%]="passwordStrength()"></div>
                  </div>
                  <p class="strength-text" [class]="'strength-' + getStrengthLevel()">
                    {{ getStrengthText() }}
                  </p>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirm New Password</mat-label>
                  <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'" 
                         [(ngModel)]="confirmPassword" name="confirmPassword" required>
                  <mat-icon matPrefix>lock</mat-icon>
                  <button mat-icon-button matSuffix type="button"
                          (click)="hideConfirmPassword.set(!hideConfirmPassword())">
                    <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </mat-form-field>

                <div *ngIf="newPassword && confirmPassword && !passwordsMatch()" 
                     class="password-mismatch">
                  <mat-icon>error</mat-icon>
                  Passwords do not match
                </div>

                <div *ngIf="errorMessage()" class="error-message">
                  <mat-icon>error</mat-icon>
                  {{ errorMessage() }}
                </div>

                <div class="button-group">
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="isLoading() || !isResetFormValid()">
                    <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
                    <span *ngIf="!isLoading()">Reset Password</span>
                  </button>
                </div>

                <div class="resend-section">
                  <button mat-button color="primary" type="button"
                          (click)="resendResetEmail()"
                          [disabled]="isLoading()">
                    Resend Reset Link
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 3: Success -->
            <mat-step>
              <ng-template matStepLabel>Complete</ng-template>
              
              <div class="success-container">
                <mat-icon class="success-icon">check_circle</mat-icon>
                <h2>Password Reset Successful!</h2>
                <p>Your password has been successfully reset.</p>
                <p>You can now login with your new password.</p>
                
                <button mat-raised-button color="primary" 
                        routerLink="/login" class="login-button">
                  Go to Login
                </button>
              </div>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px - 200px);
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .forgot-password-card {
      width: 100%;
      max-width: 600px;

      mat-card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 24px 0;

        .header-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #1976d2;
          margin-bottom: 16px;
        }

        h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 500;
        }

        p {
          margin: 0;
          color: #666;
          font-size: 16px;
          text-align: center;
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

          .hint {
            font-size: 12px;
            color: #666;
            font-weight: normal;
          }
        }

        .reset-info {
          text-align: center;
          margin-bottom: 24px;

          p {
            margin: 4px 0;
            color: #666;
          }

          .email-display {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
        }

        .password-strength {
          margin-top: -8px;

          .strength-bar {
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            overflow: hidden;

            .strength-fill {
              height: 100%;
              transition: all 0.3s;
              background: linear-gradient(90deg, #f44336, #ff9800, #4caf50);
            }
          }

          .strength-text {
            margin: 4px 0 0 0;
            font-size: 12px;
            font-weight: 500;

            &.strength-weak {
              color: #f44336;
            }

            &.strength-medium {
              color: #ff9800;
            }

            &.strength-strong {
              color: #4caf50;
            }
          }
        }

        .password-mismatch {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #ffebee;
          color: #c62828;
          border-radius: 4px;
          font-size: 14px;
          margin-top: -8px;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }

        .resend-section {
          text-align: center;
          margin-top: 16px;
        }

        .success-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 16px;
          text-align: center;

          .success-icon {
            font-size: 96px;
            width: 96px;
            height: 96px;
            color: #4caf50;
            margin-bottom: 24px;
          }

          h2 {
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 500;
            color: #333;
          }

          p {
            margin: 8px 0;
            color: #666;
            font-size: 16px;
          }

          .login-button {
            margin-top: 32px;
            height: 48px;
            padding: 0 32px;
            font-size: 16px;
          }
        }
      }
    }

    ::ng-deep .mat-stepper-horizontal {
      margin-top: 24px;
    }
  `]
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
