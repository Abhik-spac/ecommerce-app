import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, of, delay, throwError } from 'rxjs';
import { MockDataService } from './mock-data.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {
    // Check for stored auth
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.mockData.login(email, password).pipe(
      tap(response => {
        const normalizedUser: User = {
          ...response.user,
          firstName: response.user.firstName ?? response.user.name ?? '',
          lastName: response.user.lastName ?? '',
          role: response.user.role === 'CUSTOMER' ? 'USER' : response.user.role
        };
        this.currentUser.set(normalizedUser);
        this.currentUserSubject.next(normalizedUser);
        this.isAuthenticated.set(true);
        localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
        localStorage.setItem('token', response.token);
      })
    );
  }

  register(userData: any): Observable<any> {
    // Mock registration - simulate API call
    return of({
      success: true,
      message: 'Registration successful',
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        firstName: userData.firstName || userData.name || '',
        lastName: userData.lastName || '',
        role: 'USER'
      }
    }).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  // OTP Login methods
  sendOTP(phoneNumber: string): Observable<any> {
    // Mock OTP sending
    console.log('Sending OTP to:', phoneNumber);
    return of({
      success: true,
      message: 'OTP sent successfully',
      otp: '123456' // In real app, this would be sent via SMS
    }).pipe(delay(500));
  }

  verifyOTP(phoneNumber: string, otp: string): Observable<any> {
    // Mock OTP verification
    if (otp === '123456') {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: `${phoneNumber}@phone.login`,
        firstName: 'User',
        lastName: 'Phone',
        phone: phoneNumber,
        role: 'USER',
        phoneVerified: true
      };
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
      this.isAuthenticated.set(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token-' + Date.now());
      
      return of({
        success: true,
        message: 'OTP verified successfully',
        user,
        token: 'mock-token-' + Date.now()
      }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Invalid OTP')).pipe(delay(500));
    }
  }

  // Password reset methods
  forgotPassword(email: string): Observable<any> {
    // Mock forgot password - simulate sending reset email
    console.log('Sending password reset email to:', email);
    return of({
      success: true,
      message: 'Password reset email sent',
      resetToken: 'mock-reset-token-' + Date.now()
    }).pipe(delay(500));
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    // Mock password reset
    console.log('Resetting password with token:', token);
    return of({
      success: true,
      message: 'Password reset successfully'
    }).pipe(delay(500));
  }

  // Social login method
  socialLogin(provider: string, token: string): Observable<any> {
    // Mock social login
    console.log('Social login with provider:', provider);
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: `user@${provider}.com`,
      firstName: 'Social',
      lastName: 'User',
      role: 'USER',
      emailVerified: true
    };
    
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    return of({
      success: true,
      message: 'Social login successful',
      user,
      token
    }).pipe(delay(500));
  }
}

// Made with Bob
