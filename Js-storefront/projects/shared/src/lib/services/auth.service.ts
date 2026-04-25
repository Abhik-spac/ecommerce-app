import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = environment.apiUrls.auth;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);
  isGuest = signal(false);

  constructor() {
    this.initializeAuth();
  }
  
  private initializeAuth(): void {
    // Check for stored auth
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    const guestId = localStorage.getItem('guestId');
    
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
      this.isAuthenticated.set(true);
      this.isGuest.set(false);
    } else if (guestId && token) {
      this.isGuest.set(true);
      this.isAuthenticated.set(false);
    } else {
      // Create guest session automatically
      this.createGuestSession().subscribe();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          phone: response.user.phone,
          role: response.user.role,
          emailVerified: response.user.emailVerified,
          phoneVerified: response.user.phoneVerified
        };
        
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
        this.isGuest.set(false);
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', response.token);
        localStorage.removeItem('guestId'); // Clear guest session
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(response => {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          phone: response.user.phone,
          role: response.user.role,
          emailVerified: false,
          phoneVerified: false
        };
        
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
        this.isGuest.set(false);
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', response.token);
        localStorage.removeItem('guestId');
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }
  
  createGuestSession(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/guest/create`, {}).pipe(
      tap(response => {
        localStorage.setItem('guestId', response.guestId);
        localStorage.setItem('token', response.token);
        this.isGuest.set(true);
        this.isAuthenticated.set(false);
      }),
      catchError(error => {
        console.error('Create guest session error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.isGuest.set(false);
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('guestId');
    
    // Create new guest session
    this.createGuestSession().subscribe();
    
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }
  
  // Helper methods
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getGuestId(): string | null {
    return localStorage.getItem('guestId');
  }
  
  isGuestUser(): boolean {
    return this.isGuest() && !this.isAuthenticated();
  }

  // OTP Login methods
  sendOTP(phoneNumber: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/otp/send`, { phone: phoneNumber }).pipe(
      catchError(error => {
        console.error('Send OTP error:', error);
        return throwError(() => error);
      })
    );
  }

  verifyOTP(phoneNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/otp/verify`, { phone: phoneNumber, otp }).pipe(
      tap(response => {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName || 'User',
          lastName: response.user.lastName || '',
          phone: response.user.phone,
          role: response.user.role,
          phoneVerified: true
        };
        
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
        this.isGuest.set(false);
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', response.token);
        localStorage.removeItem('guestId');
      }),
      catchError(error => {
        console.error('Verify OTP error:', error);
        return throwError(() => error);
      })
    );
  }

  // Password reset methods
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email }).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, { token, newPassword }).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get current user from server
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
      tap(response => {
        if (response.type === 'user') {
          this.currentUser.set(response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
          this.isGuest.set(false);
        } else if (response.type === 'guest') {
          this.isGuest.set(true);
          this.isAuthenticated.set(false);
        }
      }),
      catchError(error => {
        console.error('Get current user error:', error);
        return throwError(() => error);
      })
    );
  }
}

// Made with Bob
