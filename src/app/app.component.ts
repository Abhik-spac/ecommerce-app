import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <div class="toolbar-content">
        <div class="logo-section">
          <button mat-icon-button>
            <mat-icon>menu</mat-icon>
          </button>
          <h1 routerLink="/" class="logo">eCommerce Store</h1>
        </div>

        <div class="nav-section">
          <button mat-button routerLink="/products">
            <mat-icon>store</mat-icon>
            Products
          </button>
        </div>

        <div class="actions-section">
          <button mat-icon-button routerLink="/cart" [matBadge]="cartService.itemCount()" matBadgeColor="accent">
            <mat-icon>shopping_cart</mat-icon>
          </button>

          <button mat-icon-button *ngIf="!authService.isAuthenticated()" routerLink="/login">
            <mat-icon>person</mat-icon>
          </button>

          <button mat-icon-button *ngIf="authService.isAuthenticated()" [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <div class="user-info" mat-menu-item disabled>
              <strong>{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</strong>
              <small>{{ authService.currentUser()?.email }}</small>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              Profile
            </button>
            <button mat-menu-item routerLink="/orders">
              <mat-icon>receipt_long</mat-icon>
              Orders
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="authService.logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Your trusted eCommerce platform</p>
        </div>
        <div class="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <button mat-icon-button><mat-icon>facebook</mat-icon></button>
            <button mat-icon-button><mat-icon>twitter</mat-icon></button>
            <button mat-icon-button><mat-icon>instagram</mat-icon></button>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 eCommerce Store. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;

      .logo {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
      }
    }

    .nav-section {
      flex: 1;
      display: flex;
      gap: 8px;
      margin-left: 32px;
    }

    .actions-section {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      padding: 8px 16px;

      strong {
        font-size: 14px;
      }

      small {
        font-size: 12px;
        color: #666;
      }
    }

    .main-content {
      min-height: calc(100vh - 64px - 200px);
      background: #fafafa;
    }

    .app-footer {
      background: #333;
      color: white;
      padding: 48px 24px 24px;

      .footer-content {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 32px;
        margin-bottom: 32px;

        .footer-section {
          h3 {
            font-size: 18px;
            margin: 0 0 16px 0;
          }

          p {
            color: #ccc;
            margin: 0;
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              margin-bottom: 8px;

              a {
                color: #ccc;
                text-decoration: none;

                &:hover {
                  color: white;
                }
              }
            }
          }

          .social-links {
            display: flex;
            gap: 8px;
          }
        }
      }

      .footer-bottom {
        text-align: center;
        padding-top: 24px;
        border-top: 1px solid #555;

        p {
          margin: 0;
          color: #ccc;
          font-size: 14px;
        }
      }
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}
}

// Made with Bob
