import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Updated interfaces to match actual API response
export interface DashboardApiResponse {
  success: boolean;
  data: {
    currentMonth: {
      income: number;
      expense: number;
      balance: number;
      incomeGrowth: number;
      expenseGrowth: number;
      balanceGrowth: number;
    };
    recentTransactions: ApiTransaction[];
    activeBudgets: ApiBudget[];
    topCategories: ApiCategoryStats[];
  };
}

export interface ApiTransaction {
  _id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  account: string;
  date: string;
  createdAt: string;
}

export interface ApiBudget {
  _id: string;
  name: string;
  amount: number;
  spent: number;
  percentageUsed: number;
  status: string;
  category: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface ApiCategoryStats {
  _id: string;
  total: number;
  count: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: ApiTransaction[];
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

export interface BudgetsResponse {
  success: boolean;
  data: {
    budgets: ApiBudget[];
  };
}

// Dashboard data interface for component
export interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBudget: number;
  budgetUsed: number;
  recentTransactions: Transaction[];
  topCategories: CategorySummary[];
  budgetAlerts: BudgetAlert[];
}

// Component-friendly interfaces
export interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  account: string;
  date: string;
  createdAt: string;
}

export interface CategorySummary {
  _id: string;
  name: string;
  icon: string;
  color: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface BudgetAlert {
  budgetId: string;
  budgetName: string;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  percentage: number;
  alertLevel: 'warning' | 'danger';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
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
   * Get main dashboard data using the correct API endpoint
   */
  getDashboardData(): Observable<DashboardApiResponse> {
    const headers = this.getHttpHeaders();
    
    return this.http.get<DashboardApiResponse>(`${this.apiUrl}/reports/dashboard`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get recent transactions with proper filtering
   */
  getRecentTransactions(limit: number = 5): Observable<TransactionsResponse> {
    const headers = this.getHttpHeaders();
    
    return this.http.get<TransactionsResponse>(
      `${this.apiUrl}/transactions?limit=${limit}&sort=-createdAt`, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get active budgets
   */
  getBudgets(status: string = 'active'): Observable<BudgetsResponse> {
    const headers = this.getHttpHeaders();
    
    return this.http.get<BudgetsResponse>(
      `${this.apiUrl}/budgets?status=${status}`, 
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get monthly report for additional analysis
   */
  getMonthlyReport(year?: number, month?: number): Observable<any> {
    const headers = this.getHttpHeaders();
    let url = `${this.apiUrl}/reports/monthly`;
    
    if (year !== undefined && month !== undefined) {
      url += `?year=${year}&month=${month}`;
    }
    
    return this.http.get(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Transform API data to component-friendly format
   */
  transformDashboardData(
    dashboardResponse: DashboardApiResponse,
    budgetsResponse?: BudgetsResponse
  ): DashboardData {
    const data = dashboardResponse.data;
    
    // Calculate total budget from active budgets
    const totalBudget = budgetsResponse?.data?.budgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
    
    // Transform transactions
    const transactions: Transaction[] = data.recentTransactions.map(tx => ({
      _id: tx._id,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      category: tx.category,
      account: tx.account,
      date: tx.date,
      createdAt: tx.createdAt
    }));

    // Transform top categories with percentage calculation
    const totalCategorySpending = data.topCategories.reduce((sum, cat) => sum + cat.total, 0);
    const categories: CategorySummary[] = data.topCategories.map(cat => ({
      _id: cat._id,
      name: cat.categoryName,
      icon: cat.categoryIcon,
      color: cat.categoryColor,
      totalAmount: cat.total,
      transactionCount: cat.count,
      percentage: totalCategorySpending > 0 ? (cat.total / totalCategorySpending) * 100 : 0
    }));

    // Generate budget alerts from active budgets
    const budgetAlerts: BudgetAlert[] = budgetsResponse?.data?.budgets
      ?.filter(budget => budget.percentageUsed >= 75) // Alert threshold
      ?.map(budget => ({
        budgetId: budget._id,
        budgetName: budget.name,
        categoryName: budget.category.name,
        budgetAmount: budget.amount,
        spentAmount: budget.spent,
        percentage: budget.percentageUsed,
        alertLevel: budget.percentageUsed >= 100 ? 'danger' : 'warning' as 'warning' | 'danger',
        message: budget.percentageUsed >= 100 
          ? `Budget ${budget.category.name} telah melebihi batas!`
          : `Budget ${budget.category.name} mendekati batas (${budget.percentageUsed.toFixed(0)}%)`
      })) || [];

    return {
      totalBalance: data.currentMonth.balance,
      monthlyIncome: data.currentMonth.income,
      monthlyExpense: data.currentMonth.expense,
      monthlyBudget: totalBudget,
      budgetUsed: totalBudget > 0 ? (data.currentMonth.expense / totalBudget) * 100 : 0,
      recentTransactions: transactions,
      topCategories: categories,
      budgetAlerts: budgetAlerts
    };
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Terjadi kesalahan saat memuat data.';
    
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && error.error.errors.length > 0) {
        errorMessage = error.error.errors[0].message || error.error.errors[0];
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Dashboard API Error:', error);
    return throwError(() => ({ message: errorMessage, error }));
  }
}