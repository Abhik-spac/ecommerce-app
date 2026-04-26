import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface Address {
  _id?: string;
  type: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface CheckoutSession {
  _id?: string;
  userId?: string;
  guestId?: string;
  currentStep: number;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod?: string;
  cartSnapshot?: any;
  totalAmount?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly apiUrl = `${environment.apiUrls.checkout}/checkout`;
  
  currentSession = signal<CheckoutSession | null>(null);
  currentStep = signal<number>(1);

  constructor(private http: HttpClient) {}

  // Save checkout session
  saveSession(sessionData: Partial<CheckoutSession>): Observable<any> {
    console.log('Saving checkout session:', sessionData);
    console.log('API URL:', `${this.apiUrl}/session`);
    return this.http.post(`${this.apiUrl}/session`, sessionData).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.currentSession.set(response.data);
          this.currentStep.set(response.data.currentStep || 1);
        }
      })
    );
  }

  // Get checkout session
  getSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/session`).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.currentSession.set(response.data);
          this.currentStep.set(response.data.currentStep || 1);
        } else {
          this.currentSession.set(null);
          this.currentStep.set(1);
        }
      })
    );
  }

  // Clear checkout session
  clearSession(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/session`).pipe(
      tap(() => {
        this.currentSession.set(null);
        this.currentStep.set(1);
      })
    );
  }

  // Update current step
  updateStep(step: number, additionalData?: Partial<CheckoutSession>): Observable<any> {
    const sessionData: Partial<CheckoutSession> = {
      currentStep: step,
      ...additionalData
    };
    return this.saveSession(sessionData);
  }

  // Save shipping address
  saveShippingAddress(address: Address): Observable<any> {
    return this.saveSession({
      currentStep: 2,
      shippingAddress: address
    });
  }

  // Save billing address
  saveBillingAddress(address: Address): Observable<any> {
    return this.saveSession({
      currentStep: 3,
      billingAddress: address
    });
  }

  // Save payment method
  savePaymentMethod(method: string): Observable<any> {
    return this.saveSession({
      currentStep: 4,
      paymentMethod: method
    });
  }

  // Get user addresses
  getUserAddresses(): Observable<any> {
    return this.http.get(`${environment.apiUrls.user}/addresses`);
  }

  // Add new address
  addAddress(address: Address): Observable<any> {
    return this.http.post(`${environment.apiUrls.user}/addresses`, address);
  }

  // Update address
  updateAddress(addressId: string, address: Partial<Address>): Observable<any> {
    return this.http.put(`${environment.apiUrls.user}/addresses/${addressId}`, address);
  }

  // Delete address
  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrls.user}/addresses/${addressId}`);
  }

  // Set default address
  setDefaultAddress(addressId: string): Observable<any> {
    return this.http.patch(`${environment.apiUrls.user}/addresses/${addressId}/default`, {});
  }
}

// Made with Bob