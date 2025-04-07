import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthService } from '../service/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  const userHasRole = requiredRoles.some(role => authService.hasRole(role));
  
  return userHasRole || router.createUrlTree(['/main-dashboard']);
};
