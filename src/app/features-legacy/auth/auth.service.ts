import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError, delay } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'B2B_USER';
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  otpSentTo: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signals for reactive state
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);
  isLoading = signal(false);

  // Mock users database
  private mockUsers = [
    {
      id: '1',
      email: 'demo@example.com',
      phone: '+919876543210',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      role: 'CUSTOMER' as const,
      emailVerified: true,
      phoneVerified: true
    },
    {
      id: '2',
      email: 'admin@example.com',
      phone: '+919876543211',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      emailVerified: true,
      phoneVerified: true
    }
  ];

  // Mock OTP storage
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor(private router: Router) {
    this.loadStoredAuth();
  }

  /**
   * Load authentication from localStorage
   */
  private loadStoredAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
      this.isAuthenticated.set(true);
    }
  }

  /**
   * Email/Password Login
   */
  login(email: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      this.isLoading.set(false);
      return throwError(() => ({ message: 'Invalid email or password' }));
    }

    const { password: _, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      user: userWithoutPassword,
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresIn: 3600
    };

    return of(response).pipe(
      delay(500), // Simulate network delay
      tap(res => {
        this.setAuthData(res);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Send OTP to phone number
   */
  sendOTP(phone: string): Observable<OTPResponse> {
    this.isLoading.set(true);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    this.otpStore.set(phone, { otp, expiresAt });

    console.log(`🔐 OTP for ${phone}: ${otp}`); // For demo purposes

    const response: OTPResponse = {
      success: true,
      message: 'OTP sent successfully',
      otpSentTo: phone,
      expiresIn: 300
    };

    return of(response).pipe(
      delay(1000),
      tap(() => this.isLoading.set(false))
    );
  }

  /**
   * Verify OTP and login
   */
  verifyOTP(phone: string, otp: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    const storedOTP = this.otpStore.get(phone);

    if (!storedOTP) {
      this.isLoading.set(false);
      return throwError(() => ({ message: 'OTP not found. Please request a new one.' }));
    }

    if (Date.now() > storedOTP.expiresAt) {
      this.otpStore.delete(phone);
      this.isLoading.set(false);
      return throwError(() => ({ message: 'OTP has expired. Please request a new one.' }));
    }

    if (storedOTP.otp !== otp) {
      this.isLoading.set(false);
      return throwError(() => ({ message: 'Invalid OTP. Please try again.' }));
    }

    // Find or create user
    let user = this.mockUsers.find(u => u.phone === phone);
    
    if (!user) {
      // Create new user for this phone number
      user = {
        id: Date.now().toString(),
        email: `user${Date.now()}@example.com`,
        phone,
        password: '',
        firstName: 'User',
        lastName: phone.slice(-4),
        role: 'CUSTOMER',
        emailVerified: false,
        phoneVerified: true
      };
      this.mockUsers.push(user);
    }

    // Clear OTP
    this.otpStore.delete(phone);

    const { password: _, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      user: userWithoutPassword,
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresIn: 3600
    };

    return of(response).pipe(
      delay(500),
      tap(res => {
        this.setAuthData(res);
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Social Login (Google)
   */
  socialLogin(provider: 'google' | 'facebook', token: string): Observable<AuthResponse> {
    this.isLoading.set(true);

    // Mock social login
    const socialUser = {
      id: Date.now().toString(),
      email: `social.user@${provider}.com`,
      firstName: 'Social',
      lastName: 'User',
      role: 'CUSTOMER' as const,
      emailVerified: true,
      phoneVerified: false,
      avatar: 'https://via.placeholder.com/100'
    };

    const response: AuthResponse = {
      user: socialUser,
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresIn: 3600
    };

    return of(response).pipe(
      delay(1000),
      tap(res => {
        this.setAuthData(res);
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Register new user
   */
  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Observable<AuthResponse> {
    this.isLoading.set(true);

    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      this.isLoading.set(false);
      return throwError(() => ({ message: 'User with this email already exists' }));
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      phone: data.phone || '',
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'CUSTOMER' as const,
      emailVerified: false,
      phoneVerified: false
    };

    this.mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const response: AuthResponse = {
      user: userWithoutPassword,
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresIn: 3600
    };

    return of(response).pipe(
      delay(500),
      tap(res => {
        this.setAuthData(res);
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return throwError(() => ({ message: 'No refresh token found' }));
    }

    const user = this.currentUser();
    if (!user) {
      return throwError(() => ({ message: 'No user found' }));
    }

    const response: AuthResponse = {
      user,
      accessToken: this.generateToken(),
      refreshToken: this.generateToken(),
      expiresIn: 3600
    };

    return of(response).pipe(
      delay(300),
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  /**
   * Forgot password - send reset link
   */
  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    const user = this.mockUsers.find(u => u.email === email);
    
    if (!user) {
      return throwError(() => ({ message: 'User not found' }));
    }

    return of({
      success: true,
      message: 'Password reset link sent to your email'
    }).pipe(delay(1000));
  }

  /**
   * Reset password
   */
  resetPassword(token: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    // Mock password reset
    return of({
      success: true,
      message: 'Password reset successfully'
    }).pipe(delay(500));
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  /**
   * Check if user is B2B
   */
  isB2BUser(): boolean {
    return this.currentUser()?.role === 'B2B_USER';
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Private helper methods
   */
  private setAuthData(response: AuthResponse): void {
    this.currentUser.set(response.user);
    this.currentUserSubject.next(response.user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  private generateToken(): string {
    return 'mock-jwt-token-' + Math.random().toString(36).substr(2) + Date.now();
  }
}

// Made with Bob
