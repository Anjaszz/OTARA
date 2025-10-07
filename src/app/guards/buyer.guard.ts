import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const buyerGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserValue;

  // If seller trying to access buyer routes, redirect to seller home
  if (user && user.role === 'seller') {
    router.navigate(['/seller/home']);
    return false;
  }

  // Allow buyers and guests (unauthenticated users)
  return true;
};
