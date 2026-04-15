import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>

      <div *ngIf="cartService.itemCount() === 0" class="empty-cart">
        <mat-icon class="empty-icon">shopping_cart</mat-icon>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button mat-raised-button color="primary" routerLink="/products">
          Continue Shopping
        </button>
      </div>

      <div *ngIf="cartService.itemCount() > 0" class="cart-content">
        <div class="cart-items">
          <mat-card *ngFor="let item of cartService.items()" class="cart-item">
            <div class="item-image">
              <img [src]="item.image" [alt]="item.name">
            </div>
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-price">₹{{ item.price | number:'1.0-0' }}</p>
            </div>
            <div class="item-quantity">
              <button mat-icon-button (click)="cartService.updateQuantity(item.id, item.quantity - 1)">
                <mat-icon>remove</mat-icon>
              </button>
              <span>{{ item.quantity }}</span>
              <button mat-icon-button (click)="cartService.updateQuantity(item.id, item.quantity + 1)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <div class="item-total">
              <p>₹{{ (item.price * item.quantity) | number:'1.0-0' }}</p>
            </div>
            <button mat-icon-button color="warn" (click)="cartService.removeItem(item.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card>
        </div>

        <mat-card class="cart-summary">
          <h2>Order Summary</h2>
          <mat-divider></mat-divider>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹{{ cartService.subtotal() | number:'1.0-0' }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (18%):</span>
            <span>₹{{ cartService.tax() | number:'1.0-0' }}</span>
          </div>
          <mat-divider></mat-divider>
          <div class="summary-row total">
            <span>Total:</span>
            <span>₹{{ cartService.total() | number:'1.0-0' }}</span>
          </div>
          <button mat-raised-button color="primary" class="checkout-btn" routerLink="/checkout">
            Proceed to Checkout
          </button>
          <button mat-button routerLink="/products">
            Continue Shopping
          </button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;

      h1 {
        font-size: 32px;
        margin-bottom: 24px;
      }
    }

    .empty-cart {
      text-align: center;
      padding: 64px;

      .empty-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: #ccc;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 24px;
        margin-bottom: 8px;
      }

      p {
        color: #666;
        margin-bottom: 24px;
      }
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 24px;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;

      .item-image {
        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }
      }

      .item-details {
        flex: 1;

        h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .item-price {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
      }

      .item-quantity {
        display: flex;
        align-items: center;
        gap: 8px;

        span {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }
      }

      .item-total {
        min-width: 100px;
        text-align: right;

        p {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1976d2;
        }
      }
    }

    .cart-summary {
      padding: 24px;
      height: fit-content;
      position: sticky;
      top: 88px;

      h2 {
        margin: 0 0 16px 0;
        font-size: 20px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        font-size: 16px;

        &.total {
          font-size: 20px;
          font-weight: 600;
          color: #1976d2;
        }
      }

      .checkout-btn {
        width: 100%;
        height: 48px;
        margin: 16px 0 8px 0;
        font-size: 16px;
      }

      button[mat-button] {
        width: 100%;
      }
    }

    @media (max-width: 968px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-summary {
        position: static;
      }
    }
  `]
})
export class CartComponent {
  constructor(public cartService: CartService) {}
}

// Made with Bob
