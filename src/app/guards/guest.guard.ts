
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
    providedIn: 'root'
  })
  export class GuestGuard implements CanActivate {
    
    constructor(
      private authService: AuthService,
      private router: Router
    ) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
      
      return this.authService.isLoggedIn$.pipe(
        take(1),
        map(isLoggedIn => {
          if (!isLoggedIn) {
            return true;
          } else {
            this.router.navigate(['/dashboard']);
            return false;
          }
        })
      );
    }
  }