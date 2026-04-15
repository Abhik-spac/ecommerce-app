import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@ecommerce/shared';

/**
 * Auth Guard - Protects routes that require authentication
 * Usage: Add to route definition: canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

/**
 * Guest Guard - Prevents authenticated users from accessing auth pages
 * Usage: Add to route definition: canActivate: [guestGuard]
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirect authenticated users to products page
  router.navigate(['/products']);
  return false;
};

/**
 * Role Guard - Protects routes based on user roles
 * Usage: Add to route data: data: { roles: ['ADMIN', 'B2B_USER'] }
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  const currentUser = authService.currentUser();

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (currentUser && requiredRoles.includes(currentUser.role)) {
    return true;
  }

  // User doesn't have required role
  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Admin Guard - Shortcut for admin-only routes
 * Usage: Add to route definition: canActivate: [adminGuard]
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const currentUser = authService.currentUser();

  if (currentUser?.role === 'ADMIN') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};

/**
 * B2B Guard - Protects B2B-specific routes
 * Usage: Add to route definition: canActivate: [b2bGuard]
 */
export const b2bGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const currentUser = authService.currentUser();

  if (currentUser?.role === 'B2B_USER' || currentUser?.role === 'ADMIN') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};

// Made with Bob - Microfrontend Architecture