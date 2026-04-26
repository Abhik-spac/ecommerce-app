import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  private apiUrl = environment.apiUrls.user;
  private wishlistItems = signal<string[]>([]);
  
  items = this.wishlistItems.asReadonly();
  
  itemCount = computed(() => this.wishlistItems().length);
  
  constructor() {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.http.get<any>(`${this.apiUrl}/wishlist`).pipe(
      tap(response => {
        this.wishlistItems.set(response.data || []);
      }),
      catchError(error => {
        console.error('Load wishlist error:', error);
        // Silently fail - wishlist will be empty
        return [];
      })
    ).subscribe();
  }

  addToWishlist(productId: string, productName?: string): void {
    this.http.post<any>(`${this.apiUrl}/wishlist`, { productId }).pipe(
      tap(response => {
        this.wishlistItems.set(response.data || []);
        this.toastService.success(productName ? `${productName} added to wishlist!` : 'Added to wishlist!');
      }),
      catchError(error => {
        console.error('Add to wishlist error:', error);
        if (error.error?.message === 'Product already in wishlist') {
          this.toastService.info('Product already in wishlist');
        } else {
          this.toastService.error('Failed to add to wishlist');
        }
        return throwError(() => error);
      })
    ).subscribe();
  }

  removeFromWishlist(productId: string, productName?: string): void {
    this.http.delete<any>(`${this.apiUrl}/wishlist/${productId}`).pipe(
      tap(response => {
        this.wishlistItems.set(response.data || []);
        this.toastService.info(productName ? `${productName} removed from wishlist` : 'Removed from wishlist');
      }),
      catchError(error => {
        console.error('Remove from wishlist error:', error);
        this.toastService.error('Failed to remove from wishlist');
        return throwError(() => error);
      })
    ).subscribe();
  }

  toggleWishlist(productId: string, productName?: string): void {
    this.http.post<any>(`${this.apiUrl}/wishlist/toggle`, { productId }).pipe(
      tap(response => {
        this.wishlistItems.set(response.data.wishlist || []);
        const message = response.data.isInWishlist
          ? (productName ? `${productName} added to wishlist!` : 'Added to wishlist!')
          : (productName ? `${productName} removed from wishlist` : 'Removed from wishlist');
        
        if (response.data.isInWishlist) {
          this.toastService.success(message);
        } else {
          this.toastService.info(message);
        }
      }),
      catchError(error => {
        console.error('Toggle wishlist error:', error);
        this.toastService.error('Failed to update wishlist');
        return throwError(() => error);
      })
    ).subscribe();
  }

  clearWishlist(): void {
    this.http.delete<any>(`${this.apiUrl}/wishlist`).pipe(
      tap(() => {
        this.wishlistItems.set([]);
        this.toastService.info('Wishlist cleared');
      }),
      catchError(error => {
        console.error('Clear wishlist error:', error);
        this.toastService.error('Failed to clear wishlist');
        return throwError(() => error);
      })
    ).subscribe();
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().includes(productId);
  }

  mergeGuestWishlist(guestId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/wishlist/merge`, { guestId }).pipe(
      tap(response => {
        this.wishlistItems.set(response.data || []);
        this.toastService.success('Wishlist merged successfully');
      }),
      catchError(error => {
        console.error('Merge wishlist error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get wishlist items for checkout
  getWishlistItems(): string[] {
    return this.wishlistItems();
  }
}

// Made with Bob