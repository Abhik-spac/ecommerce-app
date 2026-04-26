import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../order.service';
import { AuthService } from '@ecommerce/shared';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string = '';
  isValidOrder: boolean = false;
  isLoading: boolean = true;
  order: any = null;
  private authService = inject(AuthService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    
    // Validate order ID exists
    if (!this.orderId || this.orderId.trim() === '') {
      console.warn('No order ID provided, redirecting to home');
      this.router.navigate(['/']);
      return;
    }

    // Check if navigation came from checkout or tracking with order data
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || (history.state as any);
    
    if ((state?.fromCheckout || state?.fromTracking) && state?.orderData) {
      // Valid navigation with order data
      console.log('Order confirmation with data, order ID:', this.orderId);
      this.order = state.orderData;
      this.isLoading = false;
      this.isValidOrder = true;
      return;
    }

    // For direct access, fetch order from API
    console.log('Direct access to order confirmation, fetching order:', this.orderId);
    this.orderService.getOrder(this.orderId).subscribe({
      next: (order) => {
        this.isLoading = false;
        if (order) {
          this.order = order;
          this.isValidOrder = true;
          console.log('Order fetched successfully:', order);
        } else {
          console.warn(`Order ${this.orderId} not found, redirecting to home`);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error fetching order:', error);
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToOrders(): void {
    // Check if user is a guest
    if (this.authService.isGuestUser()) {
      // Redirect to track order page with email/phone from the order
      const email = this.order?.shippingAddress?.email || this.order?.shipping_address?.email;
      const phone = this.order?.shippingAddress?.phone || this.order?.shipping_address?.phone;
      
      this.router.navigate(['/orders/track'], {
        state: {
          email: email,
          phone: phone,
          autoLoad: true
        }
      });
    } else {
      // Authenticated users go to their orders page
      this.router.navigate(['/orders']);
    }
  }

  isGuestUser(): boolean {
    return this.authService.isGuestUser();
  }
}
