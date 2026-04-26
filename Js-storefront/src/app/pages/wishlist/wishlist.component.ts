import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WishlistService, CartService, ToastService } from '@ecommerce/shared';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  category: string;
  stock: number;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private http = inject(HttpClient);
  private router = inject(Router);
  
  products: Product[] = [];
  loading = true;
  
  ngOnInit() {
    this.loadWishlistProducts();
  }
  
  loadWishlistProducts() {
    this.loading = true;
    const productIds = this.wishlistService.items();
    
    console.log('Loading wishlist products for IDs:', productIds);
    
    if (productIds.length === 0) {
      this.loading = false;
      this.products = [];
      return;
    }
    
    // Fetch product details for all wishlist items
    const requests = productIds.map(id =>
      this.http.get<any>(`${environment.apiUrls.product}/products/${id}`).pipe(
        catchError(error => {
          console.error(`Error loading product ${id}:`, error);
          return of(null);
        })
      )
    );
    
    forkJoin(requests).subscribe({
      next: (responses) => {
        console.log('Product responses:', responses);
        this.products = responses
          .filter(res => res && res.data)
          .map(res => res.data);
        console.log('Loaded products:', this.products);
        this.loading = false;
        
        if (this.products.length === 0 && productIds.length > 0) {
          this.toastService.error('Could not load wishlist products');
        }
      },
      error: (error) => {
        console.error('Error loading wishlist products:', error);
        this.toastService.error('Failed to load wishlist products');
        this.loading = false;
        this.products = [];
      }
    });
  }
  
  removeFromWishlist(productId: string, productName: string) {
    this.wishlistService.removeFromWishlist(productId, productName);
    this.products = this.products.filter(p => p._id !== productId);
  }
  
  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
  
  viewProduct(productId: string) {
    this.router.navigate(['/products', productId]);
  }
}

// Made with Bob