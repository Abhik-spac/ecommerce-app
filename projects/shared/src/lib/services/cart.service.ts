import { Injectable, signal, computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);
  private cartItems = signal<CartItem[]>([]);
  
  items = this.cartItems.asReadonly();
  
  itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  tax = computed(() => this.subtotal() * 0.18); // 18% GST
  
  total = computed(() => this.subtotal() + this.tax());

  constructor() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
    }
  }

  addToCart(product: any): void {
    const existingItem = this.cartItems().find(item => item.productId === product.id);
    
    if (existingItem) {
      this.updateQuantity(existingItem.id, existingItem.quantity + 1);
      this.snackBar.open(`Updated ${product.name} quantity in cart`, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
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
      this.saveCart();
      this.snackBar.open(`${product.name} added to cart!`, 'View Cart', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }).onAction().subscribe(() => {
        // Navigate to cart - will be handled by the component
        window.location.href = '/cart';
      });
    }
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
    this.saveCart();
  }

  removeItem(itemId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }
}

// Made with Bob
