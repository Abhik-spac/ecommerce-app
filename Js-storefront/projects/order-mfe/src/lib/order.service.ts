import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface Order {
  _id?: string;
  id?: string;
  userId?: string;
  guestId?: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: any;
  billingAddress?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = this.getApiUrl();

  private getApiUrl(): string {
    const baseUrl = (window as any).__env?.ORDER_SERVICE_URL || 'http://localhost:3000/api/v1';
    return `${baseUrl}/orders`;
  }

  /**
   * Get all orders for the current user
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of([]);
      })
    );
  }

  /**
   * Get a specific order by ID
   */
  getOrder(orderId: string): Observable<Order | undefined> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${orderId}`).pipe(
      map(response => {
        if (response.success && response.data) {
          // Normalize the order ID
          const order = response.data;
          if (order._id && !order.id) {
            order.id = order._id;
          }
          return order;
        }
        return undefined;
      }),
      catchError(error => {
        console.error(`Error fetching order ${orderId}:`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Create a new order
   */
  createOrder(orderData: Partial<Order>): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, orderData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order | undefined> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${orderId}/status`, { status }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error updating order ${orderId} status:`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string): Observable<Order | undefined> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  /**
   * Download invoice for an order
   */
  downloadInvoice(orderId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${orderId}/invoice`, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error(`Error downloading invoice for order ${orderId}:`, error);
        // Return empty blob on error
        return of(new Blob());
      })
    );
  }

  /**
   * Track guest orders by email/phone - returns all orders for the contact
   */
  trackGuestOrders(email?: string, phone?: string): Observable<Order[]> {
    return this.http.post<ApiResponse<Order[]> & { count?: number }>(`${this.apiUrl}/track`, {
      email,
      phone
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          // Normalize order IDs for all orders
          const orders = Array.isArray(response.data) ? response.data : [response.data];
          return orders.map(order => {
            if (order._id && !order.id) {
              order.id = order._id;
            }
            return order;
          });
        }
        return [];
      }),
      catchError(error => {
        console.error('Error tracking guest orders:', error);
        return of([]);
      })
    );
  }
}

// Made with Bob
