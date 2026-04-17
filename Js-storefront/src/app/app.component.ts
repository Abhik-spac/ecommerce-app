import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { AuthService, CartService, ToastService } from '@ecommerce/shared';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  isHomePage = signal(false);
  showCartSidebar = signal(false);
  private subscriptions = new Subscription();

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {
    // Track current route
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        const url = event.url;
        this.isHomePage.set(url === '/' || url === '');
        // Close cart sidebar on route change
        this.showCartSidebar.set(false);
      })
    );

    // Watch for items being added to cart
    this.subscriptions.add(
      this.cartService.itemAdded$.subscribe(() => {
        // Show cart sidebar when item is added (except on home page)
        if (!this.isHomePage()) {
          this.showCartSidebar.set(true);
          
          // Auto-hide after 5 seconds
          setTimeout(() => {
            if (!this.isHomePage()) {
              this.showCartSidebar.set(false);
            }
          }, 5000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  shouldShowCartSidebar(): boolean {
    const url = this.router.url;
    // Don't show on cart or checkout pages
    if (url.includes('/cart') || url.includes('/checkout')) {
      return false;
    }
    // Show on home page only on hover or explicit toggle
    if (this.isHomePage()) {
      return this.showCartSidebar();
    }
    // Show on other pages (PLP, PDP) only when explicitly shown
    return this.showCartSidebar() && this.cartService.itemCount() > 0;
  }

  getFormattedTotal(): string {
    return this.cartService.total().toFixed(2);
  }

  getFormattedSubtotal(): string {
    return this.cartService.subtotal().toFixed(2);
  }

  getFormattedTax(): string {
    return this.cartService.tax().toFixed(2);
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
    this.toastService.success('Item removed from cart');
  }

  onCartHover(show: boolean): void {
    if (this.isHomePage()) {
      this.showCartSidebar.set(show);
    }
  }

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
  }
}

// Made with Bob
