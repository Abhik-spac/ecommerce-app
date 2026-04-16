import { Component, signal, computed } from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { AuthService, CartService } from '@ecommerce/shared';
import { filter } from 'rxjs/operators';

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
export class AppComponent {
  isHomePage = signal(false);
  showCartSidebar = signal(false);

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      this.isHomePage.set(url === '/' || url === '');
    });
  }
  
  shouldShowCartSidebar(): boolean {
    const url = this.router.url;
    // Don't show on cart or checkout pages
    if (url.includes('/cart') || url.includes('/checkout')) {
      return false;
    }
    // Show on home page only on hover
    if (this.isHomePage()) {
      return this.showCartSidebar();
    }
    // Show on other pages (PLP, PDP) if cart has items
    return this.cartService.itemCount() > 0;
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
    this.snackBar.open('Item removed from cart', 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  onCartHover(show: boolean): void {
    if (this.isHomePage()) {
      this.showCartSidebar.set(show);
    }
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000
    });
  }
}

// Made with Bob
