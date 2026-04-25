import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, tap, catchError, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { environment } from '../../../../../src/environments/environment';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  
  private apiUrl = environment.apiUrls.cart;
  private cartItems = signal<CartItem[]>([]);
  private itemAddedSubject = new Subject<void>();
  
  items = this.cartItems.asReadonly();
  itemAdded$ = this.itemAddedSubject.asObservable();
  
  itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  tax = computed(() => this.subtotal() * 0.18); // 18% GST
  
  total = computed(() => this.subtotal() + this.tax());

  constructor() {
    // Load cart from backend on initialization
    this.loadCart();
  }

  loadCart(): void {
    this.http.get<any>(`${this.apiUrl}/cart`).pipe(
      tap(response => {
        this.cartItems.set(response.items || []);
      }),
      catchError(error => {
        console.error('Load cart error:', error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  addToCart(product: any): void {
    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url || ''
    };
    
    this.http.post<any>(`${this.apiUrl}/cart/items`, item).pipe(
      tap(response => {
        this.cartItems.set(response.items || []);
        this.toastService.success(`${product.name} added to cart!`);
        this.itemAddedSubject.next();
      }),
      catchError(error => {
        console.error('Add to cart error:', error);
        this.toastService.error('Failed to add item to cart');
        return throwError(() => error);
      })
    ).subscribe();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    this.http.put<any>(`${this.apiUrl}/cart/items/${productId}`, { quantity }).pipe(
      tap(response => {
        this.cartItems.set(response.items || []);
      }),
      catchError(error => {
        console.error('Update quantity error:', error);
        this.toastService.error('Failed to update quantity');
        return throwError(() => error);
      })
    ).subscribe();
  }

  removeItem(productId: string): void {
    this.http.delete<any>(`${this.apiUrl}/cart/items/${productId}`).pipe(
      tap(response => {
        this.cartItems.set(response.items || []);
        this.toastService.info('Item removed from cart');
      }),
      catchError(error => {
        console.error('Remove item error:', error);
        this.toastService.error('Failed to remove item');
        return throwError(() => error);
      })
    ).subscribe();
  }

  clearCart(): void {
    this.http.delete<any>(`${this.apiUrl}/cart`).pipe(
      tap(() => {
        this.cartItems.set([]);
        this.toastService.info('Cart cleared');
      }),
      catchError(error => {
        console.error('Clear cart error:', error);
        this.toastService.error('Failed to clear cart');
        return throwError(() => error);
      })
    ).subscribe();
  }

  mergeGuestCart(guestId: string) {
    return this.http.post<any>(`${this.apiUrl}/cart/merge`, { guestId }).pipe(
      tap(response => {
        this.cartItems.set(response.items || []);
        this.toastService.success('Cart merged successfully');
      }),
      catchError(error => {
        console.error('Merge cart error:', error);
        return throwError(() => error);
      })
    );
  }
}

// Made with Bob
