import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, CartService } from '@ecommerce/shared';

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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  
  email = '';
  password = '';
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please enter email and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    
    const guestId = this.authService.getGuestId();

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Merge guest cart if exists
        if (guestId) {
          this.cartService.mergeGuestCart(guestId).subscribe({
            next: () => {
              this.isLoading.set(false);
              const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
              this.router.navigateByUrl(returnUrl || '/');
            },
            error: () => {
              // Continue even if merge fails
              this.isLoading.set(false);
              const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
              this.router.navigateByUrl(returnUrl || '/');
            }
          });
        } else {
          this.isLoading.set(false);
          const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
          this.router.navigateByUrl(returnUrl || '/');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password');
      }
    });
  }
}

// Made with Bob
