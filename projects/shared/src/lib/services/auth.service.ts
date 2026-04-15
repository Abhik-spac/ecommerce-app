import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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
        this.currentUser.set(response.user);
        this.currentUserSubject.next(response.user);
        this.isAuthenticated.set(true);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
      })
    );
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
}

// Made with Bob
