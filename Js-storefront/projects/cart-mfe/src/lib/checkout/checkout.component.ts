import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, CartService, GuestCheckoutFormComponent, GuestCheckoutData } from '@ecommerce/shared';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    GuestCheckoutFormComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  isGuest = signal(false);
  showGuestForm = signal(false);
  isProcessing = signal(false);
  guestData = signal<GuestCheckoutData | null>(null);

  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.isGuest.set(this.authService.isGuestUser());
  }

  onGuestFormSubmit(data: GuestCheckoutData) {
    this.guestData.set(data);
    this.showGuestForm.set(false);
  }

  onGuestFormCancel() {
    this.showGuestForm.set(false);
  }

  proceedToPayment() {
    if (this.isGuest() && !this.guestData()) {
      this.showGuestForm.set(true);
      return;
    }

    this.isProcessing.set(true);

    const checkoutData = {
      items: this.cartService.items(),
      total: this.cartService.total(),
      guestData: this.guestData()
    };

    this.http.post(`${environment.apiUrls.checkout}/checkout/process`, checkoutData)
      .subscribe({
        next: (response: any) => {
          this.cartService.clearCart();
          this.router.navigate(['/orders', response.orderId]);
        },
        error: (error) => {
          console.error('Checkout failed:', error);
          this.isProcessing.set(false);
          alert('Checkout failed. Please try again.');
        }
      });
  }
}

// Made with Bob
