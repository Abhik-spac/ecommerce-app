import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor that attaches JWT token to all outgoing requests
 * Supports both user tokens and guest tokens
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Skip token attachment for auth endpoints (login, register, etc.)
  const skipUrls = ['/auth/login', '/auth/register', '/auth/guest/create'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));
  
  if (token && !shouldSkip) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};

// Made with Bob