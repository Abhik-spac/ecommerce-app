import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor that attaches JWT token to all outgoing requests
 * Supports both user tokens and guest tokens
 *
 * Note: We read token directly from localStorage to avoid circular dependency
 * (AuthService uses HttpClient which would trigger this interceptor)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Read token directly from localStorage to avoid circular dependency
  const token = localStorage.getItem('token');
  
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