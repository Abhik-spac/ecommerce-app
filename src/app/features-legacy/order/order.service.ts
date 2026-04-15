import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Order {
  id: string;
  userId: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: any;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders = signal<Order[]>([]);

  constructor() {
    this.loadMockOrders();
  }

  private loadMockOrders(): void {
    // Load mock orders from localStorage or create sample data
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.orders.set(JSON.parse(savedOrders));
    } else {
      // Create sample orders
      const mockOrders: Order[] = [
        {
          id: 'ORD1234567890',
          userId: 'user1',
          items: [
            {
              id: '1',
              productId: '1',
              name: 'Premium Laptop',
              price: 75999,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
            }
          ],
          subtotal: 75999,
          tax: 13679.82,
          shipping: 0,
          total: 89678.82,
          status: 'delivered',
          paymentMethod: 'card',
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main Street',
            address2: 'Apt 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            phone: '+91 9876543210'
          },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: 'ORD1234567891',
          userId: 'user1',
          items: [
            {
              id: '2',
              productId: '2',
              name: 'Smartphone Pro',
              price: 54999,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
            }
          ],
          subtotal: 54999,
          tax: 9899.82,
          shipping: 0,
          total: 64898.82,
          status: 'shipped',
          paymentMethod: 'upi',
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main Street',
            address2: 'Apt 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            phone: '+91 9876543210'
          },
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-05')
        }
      ];
      this.orders.set(mockOrders);
      this.saveOrders();
    }
  }

  getOrders(): Observable<Order[]> {
    return of(this.orders()).pipe(delay(500));
  }

  getOrder(orderId: string): Observable<Order | undefined> {
    const order = this.orders().find(o => o.id === orderId);
    return of(order).pipe(delay(300));
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    const newOrder: Order = {
      id: 'ORD' + Date.now(),
      userId: orderData.userId || 'user1',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      tax: orderData.tax || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total || 0,
      status: 'pending',
      paymentMethod: orderData.paymentMethod || 'card',
      shippingAddress: orderData.shippingAddress || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.update(orders => [...orders, newOrder]);
    this.saveOrders();

    return of(newOrder).pipe(delay(1000));
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order | undefined> {
    this.orders.update(orders =>
      orders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
    this.saveOrders();

    const updatedOrder = this.orders().find(o => o.id === orderId);
    return of(updatedOrder).pipe(delay(500));
  }

  cancelOrder(orderId: string): Observable<Order | undefined> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  downloadInvoice(orderId: string): Observable<Blob> {
    // Simulate PDF generation
    const pdfContent = `Invoice for Order #${orderId}`;
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    return of(blob).pipe(delay(1000));
  }

  private saveOrders(): void {
    localStorage.setItem('orders', JSON.stringify(this.orders()));
  }
}

// Made with Bob
