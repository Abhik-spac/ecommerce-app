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
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" 
                     [(ngModel)]="password" name="password" required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" 
                      (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div *ngIf="errorMessage()" class="error-message">
              <mat-icon>error</mat-icon>
              {{ errorMessage() }}
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    class="login-btn" [disabled]="isLoading()">
              <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading()">Sign In</span>
            </button>
          </form>

          <div class="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Customer: demo&#64;example.com / demo123</p>
            <p>Admin: admin&#64;example.com / admin123</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px - 200px);
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 450px;

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

          .login-btn {
            width: 100%;
            height: 48px;
            font-size: 16px;
            margin-top: 8px;

            mat-spinner {
              display: inline-block;
              margin: 0 auto;
            }
          }
        }

        .demo-credentials {
          margin-top: 24px;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 14px;

          p {
            margin: 4px 0;
            color: #666;

            strong {
              color: #333;
            }
          }
        }
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please enter email and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password');
      }
    });
  }
}

// Made with Bob
