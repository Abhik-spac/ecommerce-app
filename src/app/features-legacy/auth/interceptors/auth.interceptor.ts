import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

/**
 * Auth Interceptor - Adds JWT token to outgoing requests
 * Handles token refresh on 401 errors
 * 
 * Usage: Provide in app.config.ts:
 * provideHttpClient(withInterceptors([authInterceptor]))
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip token injection for auth endpoints
  const skipUrls = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/otp'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));

  if (shouldSkip || !authService.isAuthenticated()) {
    return next(req);
  }

  // Clone request and add Authorization header
  const token = authService.getAccessToken();
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - Token expired
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new token
            const newToken = authService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Refresh failed, logout user
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }

      return throwError(() => error);
    })
  );
};

/**
 * Logging Interceptor - Logs HTTP requests and responses (for development)
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.log(`[HTTP] ${req.method} ${req.url}`);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const duration = Date.now() - startTime;
      console.error(`[HTTP ERROR] ${req.method} ${req.url} - ${error.status} (${duration}ms)`, error);
      return throwError(() => error);
    })
  );
};

/**
 * Cache Interceptor - Adds cache control headers
 */
export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Add cache control headers
  const clonedReq = req.clone({
    setHeaders: {
      'Cache-Control': 'max-age=300', // 5 minutes
    }
  });

  return next(clonedReq);
};

/**
 * Error Handler Interceptor - Provides user-friendly error messages
 */
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status}`;
        }
      }

      console.error('HTTP Error:', errorMessage, error);
      
      return throwError(() => ({
        ...error,
        message: errorMessage
      }));
    })
  );
};

/**
 * Retry Interceptor - Retries failed requests
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  let retryCount = 0;

  const retry = (): any => {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only retry on network errors or 5xx server errors
        if (
          retryCount < maxRetries &&
          (error.status === 0 || error.status >= 500)
        ) {
          retryCount++;
          console.log(`Retrying request (${retryCount}/${maxRetries})...`);
          
          return new Promise(resolve => {
            setTimeout(() => resolve(retry()), retryDelay * retryCount);
          });
        }

        return throwError(() => error);
      })
    );
  };

  return retry();
};

// Made with Bob
