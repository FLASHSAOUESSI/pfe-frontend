import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  // Check if user is admin
  if (jwtService.isAdmin()) {
    return true;
  }

  // If token is expired, redirect to login
  if (jwtService.isTokenExpired()) {
    router.navigate(['/login']);
    return false;
  }

  // If not admin, redirect to home page
  router.navigate(['/accueil']);
  return false;
};
