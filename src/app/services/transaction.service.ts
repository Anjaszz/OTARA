import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Interfaces based on API documentation
export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  parentCategory?: string;
  order: number;
  budget?: {
    monthly: number;
    yearly: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

export interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  category: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  description: string;
  account: 'cash' | 'bank' | 'credit_card' | 'e_wallet' | 'savings';
  paymentMethod?: string;
  date: string;
  location?: string;
  notes?: string;
  tags?: string[];
  user: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTransactionRequest {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  category: string;
  description: string;
  account: 'cash' | 'bank' | 'credit_card' | 'e_wallet' | 'savings';
  paymentMethod?: string;
  date: string;
  location?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateTransactionResponse {
  success: boolean;
  message: string;
  data: {
    transaction: Transaction;
  };
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    summary: {
      totalIncome: number;
      totalExpense: number;
      totalTransactions: number;
      balance: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHttpHeaders(): HttpHeaders {
    const token = this.authService.tokenValue;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * Create new transaction
   */
  createTransaction(transactionData: CreateTransactionRequest): Observable<CreateTransactionResponse> {
    const headers = this.getHttpHeaders();
    
    return this.http.post<CreateTransactionResponse>(
      `${this.apiUrl}/transactions`, 
      transactionData, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get transactions with filters
   */
  getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expense' | 'transfer';
    category?: string;
    account?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Observable<TransactionsResponse> {
    const headers = this.getHttpHeaders();
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams.toString() 
      ? `${this.apiUrl}/transactions?${queryParams.toString()}`
      : `${this.apiUrl}/transactions`;
    
    return this.http.get<TransactionsResponse>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get transaction by ID
   */
  getTransaction(id: string): Observable<{success: boolean; data: {transaction: Transaction}}> {
    const headers = this.getHttpHeaders();
    
    return this.http.get<{success: boolean; data: {transaction: Transaction}}>(
      `${this.apiUrl}/transactions/${id}`, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update transaction
   */
  updateTransaction(id: string, transactionData: Partial<CreateTransactionRequest>): Observable<CreateTransactionResponse> {
    const headers = this.getHttpHeaders();
    
    return this.http.put<CreateTransactionResponse>(
      `${this.apiUrl}/transactions/${id}`, 
      transactionData, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete transaction (soft delete)
   */
  deleteTransaction(id: string): Observable<{success: boolean; message: string}> {
    const headers = this.getHttpHeaders();
    
    return this.http.delete<{success: boolean; message: string}>(
      `${this.apiUrl}/transactions/${id}`, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Terjadi kesalahan saat memproses transaksi.';
    
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && error.error.errors.length > 0) {
        // Handle validation errors
        const firstError = error.error.errors[0];
        errorMessage = firstError.message || firstError;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Transaction API Error:', error);
    return throwError(() => ({ message: errorMessage, error }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHttpHeaders(): HttpHeaders {
    const token = this.authService.tokenValue;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * Get all categories with optional filters
   */
  getCategories(type?: 'income' | 'expense', includeUsage?: boolean): Observable<CategoriesResponse> {
    const headers = this.getHttpHeaders();
    
    const queryParams = new URLSearchParams();
    if (type) {
      queryParams.append('type', type);
    }
    if (includeUsage) {
      queryParams.append('includeUsage', 'true');
    }
    
    const url = queryParams.toString() 
      ? `${this.apiUrl}/categories?${queryParams.toString()}`
      : `${this.apiUrl}/categories`;
    
    return this.http.get<CategoriesResponse>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create new category
   */
  createCategory(categoryData: {
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
    description?: string;
  }): Observable<{success: boolean; message: string; data: {category: Category}}> {
    const headers = this.getHttpHeaders();
    
    return this.http.post<{success: boolean; message: string; data: {category: Category}}>(
      `${this.apiUrl}/categories`, 
      categoryData, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Terjadi kesalahan saat memproses kategori.';
    
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && error.error.errors.length > 0) {
        const firstError = error.error.errors[0];
        errorMessage = firstError.message || firstError;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Category API Error:', error);
    return throwError(() => ({ message: errorMessage, error }));
  }
}