import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService, Order } from '../order.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss'
})
export class TrackOrderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private router = inject(Router);

  trackingForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  trackedOrders: Order[] = [];

  constructor() {
    this.trackingForm = this.fb.group({
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]]
    }, {
      validators: this.atLeastOneContactValidator
    });
  }

  ngOnInit(): void {
    // Check if we have navigation state with email/phone from order confirmation
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || (history.state as any);
    
    if (state?.autoLoad && (state?.email || state?.phone)) {
      // Pre-fill the form
      if (state.email) {
        this.trackingForm.patchValue({ email: state.email });
      }
      if (state.phone) {
        this.trackingForm.patchValue({ phone: state.phone });
      }
      
      // Auto-load orders
      this.onTrackOrder();
    }
  }

  // Custom validator to ensure at least email or phone is provided
  private atLeastOneContactValidator(group: FormGroup): { [key: string]: boolean } | null {
    const email = group.get('email')?.value;
    const phone = group.get('phone')?.value;
    
    if (!email && !phone) {
      return { atLeastOneContact: true };
    }
    return null;
  }

  onTrackOrder(): void {
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.trackedOrders = [];

    const { email, phone } = this.trackingForm.value;

    this.orderService.trackGuestOrders(email || undefined, phone || undefined)
      .subscribe({
        next: (orders: Order[]) => {
          this.isLoading = false;
          if (orders && orders.length > 0) {
            this.trackedOrders = orders;
          } else {
            this.errorMessage = 'No orders found for the provided contact information.';
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred while tracking your orders. Please try again.';
          console.error('Track order error:', err);
        }
      });
  }

  expandedOrderId: string | null = null;

  viewOrderDetails(order: Order): void {
    const orderId = (order.id || order._id) as string;
    // Toggle expansion instead of navigation
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
    }
  }

  isOrderExpanded(order: Order): boolean {
    const orderId = (order.id || order._id) as string;
    return this.expandedOrderId === orderId;
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': 'orange',
      'PROCESSING': 'blue',
      'SHIPPED': 'purple',
      'DELIVERED': 'green',
      'CANCELLED': 'red'
    };
    return statusColors[status] || 'gray';
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = new Date(date);
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  }

  getShippingAddress(order: Order): any {
    // Handle both camelCase and snake_case from API
    return order.shippingAddress || (order as any).shipping_address;
  }

  getOrderDate(order: Order): Date | string {
    // Handle both camelCase and snake_case from API
    return order.createdAt || (order as any).created_at;
  }
}

// Made with Bob