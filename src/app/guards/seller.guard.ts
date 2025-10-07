import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sellerGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserValue;

  // If not authenticated, redirect to login
  if (!user) {
    router.navigate(['/masuk']);
    return false;
  }

  // If buyer trying to access seller routes, redirect to dashboard
  if (user.role === 'buyer') {
    router.navigate(['/dashboard']);
    return false;
  }

  // Allow sellers
  return user.role === 'seller';
};
