import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>Welcome to eCommerce Store</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <button mat-raised-button color="primary" routerLink="/products" class="cta-button">
            Shop Now
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <h2>Shop by Category</h2>
        <div class="categories-grid">
          <mat-card class="category-card" routerLink="/products" [queryParams]="{category: 'electronics'}">
            <mat-card-content>
              <mat-icon class="category-icon">devices</mat-icon>
              <h3>Electronics</h3>
              <p>Latest gadgets and tech</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card" routerLink="/products" [queryParams]="{category: 'clothing'}">
            <mat-card-content>
              <mat-icon class="category-icon">checkroom</mat-icon>
              <h3>Clothing</h3>
              <p>Fashion for everyone</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card" routerLink="/products" [queryParams]="{category: 'books'}">
            <mat-card-content>
              <mat-icon class="category-icon">menu_book</mat-icon>
              <h3>Books</h3>
              <p>Knowledge at your fingertips</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card" routerLink="/products" [queryParams]="{category: 'home'}">
            <mat-card-content>
              <mat-icon class="category-icon">home_work</mat-icon>
              <h3>Home & Garden</h3>
              <p>Make your house a home</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card" routerLink="/products" [queryParams]="{category: 'sports'}">
            <mat-card-content>
              <mat-icon class="category-icon">sports_soccer</mat-icon>
              <h3>Sports</h3>
              <p>Stay active and healthy</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card" routerLink="/products">
            <mat-card-content>
              <mat-icon class="category-icon">store</mat-icon>
              <h3>All Products</h3>
              <p>Browse everything</p>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2>Why Shop With Us?</h2>
        <div class="features-grid">
          <div class="feature">
            <mat-icon>local_shipping</mat-icon>
            <h3>Free Shipping</h3>
            <p>On orders over $50</p>
          </div>
          <div class="feature">
            <mat-icon>verified_user</mat-icon>
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
          <div class="feature">
            <mat-icon>support_agent</mat-icon>
            <h3>24/7 Support</h3>
            <p>Always here to help</p>
          </div>
          <div class="feature">
            <mat-icon>autorenew</mat-icon>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <h2>Ready to Start Shopping?</h2>
        <p>Join thousands of satisfied customers</p>
        <div class="cta-buttons">
          <button mat-raised-button color="primary" routerLink="/products">
            Browse Products
          </button>
          <button mat-raised-button routerLink="/register">
            Create Account
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 120px 24px;
      text-align: center;
      margin-bottom: 48px;

      .hero-content {
        max-width: 800px;
        margin: 0 auto;

        h1 {
          font-size: 48px;
          margin: 0 0 16px 0;
          font-weight: 700;
        }

        p {
          font-size: 24px;
          margin: 0 0 32px 0;
          opacity: 0.9;
        }

        .cta-button {
          font-size: 18px;
          padding: 12px 32px;
          height: auto;

          mat-icon {
            margin-left: 8px;
          }
        }
      }
    }

    .categories-section {
      padding: 48px 24px;

      h2 {
        text-align: center;
        font-size: 36px;
        margin: 0 0 48px 0;
        color: #333;
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;

        .category-card {
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          text-align: center;

          &:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          }

          mat-card-content {
            padding: 32px 16px;

            .category-icon {
              font-size: 64px;
              width: 64px;
              height: 64px;
              color: #667eea;
              margin-bottom: 16px;
            }

            h3 {
              font-size: 20px;
              margin: 0 0 8px 0;
              color: #333;
            }

            p {
              color: #666;
              margin: 0;
            }
          }
        }
      }
    }

    .features-section {
      background: #f5f5f5;
      padding: 48px 24px;

      h2 {
        text-align: center;
        font-size: 36px;
        margin: 0 0 48px 0;
        color: #333;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 32px;
        max-width: 1000px;
        margin: 0 auto;

        .feature {
          text-align: center;

          mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            color: #667eea;
            margin-bottom: 16px;
          }

          h3 {
            font-size: 18px;
            margin: 0 0 8px 0;
            color: #333;
          }

          p {
            color: #666;
            margin: 0;
          }
        }
      }
    }

    .cta-section {
      padding: 80px 24px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      h2 {
        font-size: 36px;
        margin: 0 0 16px 0;
      }

      p {
        font-size: 20px;
        margin: 0 0 32px 0;
        opacity: 0.9;
      }

      .cta-buttons {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;

        button {
          font-size: 16px;
          padding: 12px 32px;
          height: auto;
        }
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 60px 24px;

        .hero-content {
          h1 {
            font-size: 32px;
          }

          p {
            font-size: 18px;
          }
        }
      }

      .categories-section h2,
      .features-section h2,
      .cta-section h2 {
        font-size: 28px;
      }
    }
  `]
})
export class HomeComponent {}

// Made with Bob
