import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="orders-container">
      <h1>My Orders</h1>

      <mat-tab-group>
        <mat-tab label="All Orders">
          <div class="orders-content">
            <div *ngIf="isLoading()" class="loading">
              <mat-spinner></mat-spinner>
            </div>

            <div *ngIf="!isLoading() && orders().length === 0" class="empty-state">
              <mat-icon>shopping_bag</mat-icon>
              <h2>No orders yet</h2>
              <p>Start shopping to see your orders here</p>
              <button mat-raised-button color="primary" routerLink="/products">
                Browse Products
              </button>
            </div>

            <div *ngIf="!isLoading() && orders().length > 0" class="orders-list">
              <mat-card *ngFor="let order of orders()" class="order-card">
                <mat-card-header>
                  <div class="order-header">
                    <div class="order-info">
                      <h3>Order #{{ order.id }}</h3>
                      <p class="order-date">{{ order.createdAt | date:'medium' }}</p>
                    </div>
                    <mat-chip [class]="'status-' + order.status">
                      {{ getStatusLabel(order.status) }}
                    </mat-chip>
                  </div>
                </mat-card-header>

                <mat-card-content>
                  <div class="order-items">
                    <div *ngFor="let item of order.items" class="order-item">
                      <img [src]="item.image" [alt]="item.name">
                      <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <p>Quantity: {{ item.quantity }}</p>
                        <p class="price">₹{{ item.price * item.quantity | number:'1.2-2' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="order-summary">
                    <div class="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{{ order.subtotal | number:'1.2-2' }}</span>
                    </div>
                    <div class="summary-row">
                      <span>Tax:</span>
                      <span>₹{{ order.tax | number:'1.2-2' }}</span>
                    </div>
                    <div class="summary-row">
                      <span>Shipping:</span>
                      <span>{{ order.shipping === 0 ? 'FREE' : '₹' + order.shipping }}</span>
                    </div>
                    <div class="summary-row total">
                      <span>Total:</span>
                      <span>₹{{ order.total | number:'1.2-2' }}</span>
                    </div>
                  </div>

                  <div class="shipping-address">
                    <h4>Shipping Address</h4>
                    <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
                    <p>{{ order.shippingAddress.address1 }}</p>
                    <p *ngIf="order.shippingAddress.address2">{{ order.shippingAddress.address2 }}</p>
                    <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.postalCode }}</p>
                  </div>
                </mat-card-content>

                <mat-card-actions>
                  <button mat-button [routerLink]="['/orders', order.id]">
                    <mat-icon>visibility</mat-icon>
                    View Details
                  </button>
                  <button mat-button *ngIf="order.status === 'delivered'" (click)="downloadInvoice(order.id)">
                    <mat-icon>download</mat-icon>
                    Download Invoice
                  </button>
                  <button mat-button color="warn" *ngIf="canCancel(order.status)" (click)="cancelOrder(order.id)">
                    <mat-icon>cancel</mat-icon>
                    Cancel Order
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Pending">
          <div class="orders-content">
            <div class="orders-list">
              <mat-card *ngFor="let order of getPendingOrders()" class="order-card">
                <!-- Same content as above -->
                <mat-card-header>
                  <div class="order-header">
                    <div class="order-info">
                      <h3>Order #{{ order.id }}</h3>
                      <p class="order-date">{{ order.createdAt | date:'medium' }}</p>
                    </div>
                    <mat-chip [class]="'status-' + order.status">
                      {{ getStatusLabel(order.status) }}
                    </mat-chip>
                  </div>
                </mat-card-header>
                <mat-card-content>
                  <div class="order-items">
                    <div *ngFor="let item of order.items" class="order-item">
                      <img [src]="item.image" [alt]="item.name">
                      <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <p>Quantity: {{ item.quantity }}</p>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Delivered">
          <div class="orders-content">
            <div class="orders-list">
              <mat-card *ngFor="let order of getDeliveredOrders()" class="order-card">
                <mat-card-header>
                  <div class="order-header">
                    <div class="order-info">
                      <h3>Order #{{ order.id }}</h3>
                      <p class="order-date">{{ order.createdAt | date:'medium' }}</p>
                    </div>
                    <mat-chip class="status-delivered">
                      Delivered
                    </mat-chip>
                  </div>
                </mat-card-header>
                <mat-card-content>
                  <div class="order-items">
                    <div *ngFor="let item of order.items" class="order-item">
                      <img [src]="item.image" [alt]="item.name">
                      <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <p>Quantity: {{ item.quantity }}</p>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button (click)="downloadInvoice(order.id)">
                    <mat-icon>download</mat-icon>
                    Download Invoice
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;

      h1 {
        margin: 0 0 24px 0;
        font-size: 32px;
        font-weight: 500;
      }
    }

    .orders-content {
      padding: 24px 0;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;

      mat-icon {
        font-size: 96px;
        width: 96px;
        height: 96px;
        color: #ccc;
        margin-bottom: 24px;
      }

      h2 {
        margin: 0 0 12px 0;
        font-size: 24px;
        font-weight: 500;
        color: #666;
      }

      p {
        margin: 0 0 24px 0;
        color: #999;
        font-size: 16px;
      }
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-card {
      mat-card-header {
        padding: 16px;
        background: #f5f5f5;

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;

          .order-info {
            h3 {
              margin: 0 0 4px 0;
              font-size: 18px;
              font-weight: 600;
            }

            .order-date {
              margin: 0;
              color: #666;
              font-size: 14px;
            }
          }

          mat-chip {
            &.status-pending {
              background: #fff3e0;
              color: #f57c00;
            }

            &.status-processing {
              background: #e3f2fd;
              color: #1976d2;
            }

            &.status-shipped {
              background: #e8f5e9;
              color: #388e3c;
            }

            &.status-delivered {
              background: #c8e6c9;
              color: #2e7d32;
            }

            &.status-cancelled {
              background: #ffebee;
              color: #c62828;
            }
          }
        }
      }

      mat-card-content {
        padding: 24px;

        .order-items {
          margin-bottom: 24px;

          .order-item {
            display: flex;
            gap: 16px;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
              border-bottom: none;
            }

            img {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 8px;
            }

            .item-details {
              flex: 1;

              h4 {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 500;
              }

              p {
                margin: 4px 0;
                color: #666;
                font-size: 14px;
              }

              .price {
                color: #1976d2;
                font-weight: 600;
                font-size: 16px;
              }
            }
          }
        }

        .order-summary {
          padding: 16px;
          background: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 16px;

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 16px;

            &.total {
              font-size: 20px;
              font-weight: 600;
              color: #1976d2;
              border-top: 2px solid #e0e0e0;
              padding-top: 12px;
              margin-top: 8px;
            }
          }
        }

        .shipping-address {
          h4 {
            margin: 0 0 12px 0;
            font-size: 16px;
            font-weight: 600;
          }

          p {
            margin: 4px 0;
            color: #666;
            font-size: 14px;
          }
        }
      }

      mat-card-actions {
        padding: 16px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }
  `]
})
export class OrderListComponent implements OnInit {
  orders = signal<any[]>([]);
  isLoading = signal(true);

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading.set(false);
      }
    });
  }

  getPendingOrders(): any[] {
    return this.orders().filter(order => 
      ['pending', 'processing', 'shipped'].includes(order.status)
    );
  }

  getDeliveredOrders(): any[] {
    return this.orders().filter(order => order.status === 'delivered');
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }

  canCancel(status: string): boolean {
    return ['pending', 'processing'].includes(status);
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
        }
      });
    }
  }

  downloadInvoice(orderId: string): void {
    this.orderService.downloadInvoice(orderId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${orderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
      }
    });
  }
}

// Made with Bob
