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
import { AuthService } from '../auth.service';

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
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <h1>Create Account</h1>
          <p>Join us and start shopping</p>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <div class="name-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput type="text" [(ngModel)]="formData.firstName" 
                       name="firstName" required>
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput type="text" [(ngModel)]="formData.lastName" 
                       name="lastName" required>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="formData.email" 
                     name="email" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone Number</mat-label>
              <input matInput type="tel" [(ngModel)]="formData.phone" 
                     name="phone" placeholder="+91 9876543210">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" 
                     [(ngModel)]="formData.password" name="password" required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button"
                      (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div class="password-strength" *ngIf="formData.password">
              <div class="strength-bar">
                <div class="strength-fill" [style.width.%]="passwordStrength()"></div>
              </div>
              <p class="strength-text" [class]="'strength-' + getStrengthLevel()">
                {{ getStrengthText() }}
              </p>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'" 
                     [(ngModel)]="formData.confirmPassword" name="confirmPassword" required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button"
                      (click)="hideConfirmPassword.set(!hideConfirmPassword())">
                <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div *ngIf="formData.password && formData.confirmPassword && !passwordsMatch()" 
                 class="password-mismatch">
              <mat-icon>error</mat-icon>
              Passwords do not match
            </div>

            <mat-checkbox [(ngModel)]="formData.acceptTerms" name="acceptTerms" 
                          class="terms-checkbox">
              I agree to the <a href="#" (click)="$event.preventDefault()">Terms & Conditions</a> 
              and <a href="#" (click)="$event.preventDefault()">Privacy Policy</a>
            </mat-checkbox>

            <div *ngIf="errorMessage()" class="error-message">
              <mat-icon>error</mat-icon>
              {{ errorMessage() }}
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    class="register-button"
                    [disabled]="isLoading() || !isFormValid()">
              <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading()">Create Account</span>
            </button>
          </form>

          <mat-divider class="divider"></mat-divider>

          <div class="social-login">
            <p>Or sign up with</p>
            <div class="social-buttons">
              <button mat-stroked-button (click)="socialLogin('google')" 
                      [disabled]="isLoading()">
                <img src="https://www.google.com/favicon.ico" alt="Google" width="20">
                Google
              </button>
              <button mat-stroked-button (click)="socialLogin('facebook')" 
                      [disabled]="isLoading()">
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" width="20">
                Facebook
              </button>
            </div>
          </div>

          <div class="login-link">
            Already have an account? <a routerLink="/login">Sign In</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px - 200px);
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .register-card {
      width: 100%;
      max-width: 600px;

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

          .name-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;

            @media (max-width: 600px) {
              grid-template-columns: 1fr;
            }
          }

          .full-width {
            width: 100%;
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

          .terms-checkbox {
            margin: 8px 0;

            a {
              color: #1976d2;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
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

          .register-button {
            height: 48px;
            font-size: 16px;
            margin-top: 8px;

            mat-spinner {
              display: inline-block;
              margin: 0 auto;
            }
          }
        }

        .divider {
          margin: 24px 0;
        }

        .social-login {
          text-align: center;

          p {
            margin: 0 0 16px 0;
            color: #666;
            font-size: 14px;
          }

          .social-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;

            button {
              flex: 1;
              max-width: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;

              img {
                width: 20px;
                height: 20px;
              }
            }
          }
        }

        .login-link {
          text-align: center;
          margin-top: 24px;
          color: #666;

          a {
            color: #1976d2;
            text-decoration: none;
            font-weight: 500;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  `]
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
