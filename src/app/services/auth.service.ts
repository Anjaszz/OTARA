import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  language: string;
  monthlyBudget?: number;
  avatar?: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  currency?: string;
  language?: string;
  monthlyBudget?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Sesuaikan dengan backend URL Anda
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on service initialization
    this.checkStoredAuth();
  }

  private async checkStoredAuth(): Promise<void> {
    const token = localStorage.getItem('kaskita_token');
    const userData = localStorage.getItem('kaskita_user');
    
    if (token) {
      this.tokenSubject.next(token);
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // If stored user data is corrupted, fetch fresh data
          await this.fetchFreshUserData();
        }
      } else {
        // Token exists but no user data, fetch fresh data
        await this.fetchFreshUserData();
      }
    }
  }

  private async fetchFreshUserData(): Promise<void> {
    try {
      const response = await this.getProfile().toPromise();
      if (response?.success && response.data) {
        this.currentUserSubject.next(response.data);
        localStorage.setItem('kaskita_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch fresh user data:', error);
      // If we can't fetch user data with existing token, clear auth
      this.clearAuth();
    }
  }

  private getHttpHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            console.log('Registration successful:', response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setAuth(response.data.user, response.data.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    const headers = this.getHttpHeaders();
    
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers })
      .pipe(
        tap(() => {
          this.clearAuth();
        }),
        catchError(error => {
          // Even if logout fails on server, clear local auth
          this.clearAuth();
          return throwError(error);
        })
      );
  }

  getProfile(): Observable<ApiResponse<User>> {
    const headers = this.getHttpHeaders();
    
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/auth/profile`, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem('kaskita_user', JSON.stringify(response.data));
          }
        }),
        catchError(this.handleError)
      );
  }

  updateProfile(userData: Partial<User>): Observable<ApiResponse<User>> {
    const headers = this.getHttpHeaders();
    
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/auth/profile`, userData, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem('kaskita_user', JSON.stringify(response.data));
          }
        }),
        catchError(this.handleError)
      );
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<ApiResponse<any>> {
    const headers = this.getHttpHeaders();
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/auth/change-password`, passwordData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private setAuth(user: User, token: string): void {
    localStorage.setItem('kaskita_token', token);
    localStorage.setItem('kaskita_user', JSON.stringify(user));
    this.tokenSubject.next(token);
    this.currentUserSubject.next(user);
  }

  private clearAuth(): void {
    localStorage.removeItem('kaskita_token');
    localStorage.removeItem('kaskita_user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
    
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && error.error.errors.length > 0) {
        errorMessage = error.error.errors[0];
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('API Error:', error);
    return throwError({ message: errorMessage, error });
  }

  // Helper methods
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.tokenValue;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  // Method to refresh user data manually
  refreshUserData(): Observable<ApiResponse<User>> {
    return this.getProfile();
  }
}