import { Injectable, signal, computed, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastService } from './toast.service';

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
  private toastService = inject(ToastService);
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
    // Cart will be managed via API calls
    // No localStorage usage - data will come from backend
  }

  addToCart(product: any): void {
    const existingItem = this.cartItems().find(item => item.productId === product.id);
    
    if (existingItem) {
      this.updateQuantity(existingItem.id, existingItem.quantity + 1);
      this.toastService.info(`Updated ${product.name} quantity in cart`);
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url || ''
      };
      this.cartItems.update(items => [...items, newItem]);
      this.toastService.success(`${product.name} added to cart!`);
    }
    
    // Emit event that item was added
    this.itemAddedSubject.next();
    
    // TODO: Call API to add item to cart
    // this.http.post('/api/cart/items', newItem).subscribe(...)
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    
    this.cartItems.update(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    
    // TODO: Call API to update cart item quantity
    // this.http.put(`/api/cart/items/${itemId}`, { quantity }).subscribe(...)
  }

  removeItem(itemId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    
    // TODO: Call API to remove cart item
    // this.http.delete(`/api/cart/items/${itemId}`).subscribe(...)
  }

  clearCart(): void {
    this.cartItems.set([]);
    
    // TODO: Call API to clear cart
    // this.http.delete('/api/cart').subscribe(...)
  }

  // TODO: Add method to load cart from API
  // loadCart(): void {
  //   this.http.get<CartItem[]>('/api/cart/items').subscribe(items => {
  //     this.cartItems.set(items);
  //   });
  // }
}

// Made with Bob
