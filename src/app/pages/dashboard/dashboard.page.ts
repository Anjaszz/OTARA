import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonSpinner,
  IonToast, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  walletOutline,
  trendingUpOutline,
  trendingDownOutline,
  pieChartOutline,
  addOutline,
  cardOutline,
  cashOutline,
  timeOutline,
  eyeOutline,
  eyeOffOutline,
  refreshOutline,
  settingsOutline,
  notificationsOutline,
  statsChartOutline,
  arrowUpOutline,
  arrowDownOutline, chevronForwardOutline, receiptOutline } from 'ionicons/icons';
import { AuthService, User } from 'src/app/services/auth.service';
import { 
  DashboardService, 
  DashboardData,
  DashboardApiResponse,
  BudgetsResponse 
} from 'src/app/services/dashboard.service';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonToast
  ]
})
export class DashboardPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  dashboardData: DashboardData | null = null;
  isLoading = true;
  showBalance = true;
  showToast = false;
  toastMessage = '';
  toastColor = 'primary';
  
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    addIcons({walletOutline,refreshOutline,settingsOutline,addOutline,timeOutline,trendingUpOutline,trendingDownOutline,chevronForwardOutline,cardOutline,receiptOutline,pieChartOutline,cashOutline,eyeOutline,eyeOffOutline,notificationsOutline,statsChartOutline,arrowUpOutline,arrowDownOutline});
  }

  ngOnInit() {
    this.loadCurrentUser();
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadCurrentUser() {
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.subscriptions.add(userSub);
  }

  private loadDashboardData() {
    this.isLoading = true;
    
    // Use the correct API endpoints
    const dashboardData$ = this.dashboardService.getDashboardData();
    const budgets$ = this.dashboardService.getBudgets('active');

    const subscription = forkJoin({
      dashboard: dashboardData$,
      budgets: budgets$
    }).subscribe({
      next: (responses) => {
        try {
          // Transform API data to component format
          this.dashboardData = this.dashboardService.transformDashboardData(
            responses.dashboard,
            responses.budgets
          );
          this.isLoading = false;
        } catch (error) {
          console.error('Error transforming dashboard data:', error);
          this.handleDataError(error);
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.handleDataError(error);
      }
    });

    this.subscriptions.add(subscription);
  }

  private handleDataError(error: any) {
    this.showToastMessage(error?.message || 'Gagal memuat data dashboard', 'danger');
    
    // Provide fallback empty state
    this.dashboardData = {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
      monthlyBudget: 0,
      budgetUsed: 0,
      recentTransactions: [],
      topCategories: [],
      budgetAlerts: []
    };
    this.isLoading = false;
  }

  toggleBalanceVisibility() {
    this.showBalance = !this.showBalance;
  }

  async refreshData() {
    this.loadDashboardData();
    this.showToastMessage('Data berhasil diperbarui', 'success');
  }

  navigateToTransactions() {
    this.router.navigate(['/tabs/transactions']);
  }

  navigateToAddTransaction() {
    this.router.navigate(['/add-transaction']);
  }

  navigateToBudgets() {
    this.router.navigate(['/tabs/budgets']);
  }

  navigateToReports() {
    this.router.navigate(['/tabs/reports']);
  }

  navigateToSettings() {
    this.router.navigate(['/profile']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours < 1) {
      return `${diffMins} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else {
      return this.formatDate(dateString);
    }
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  get greetingMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  }

  get budgetPercentage(): number {
    if (!this.dashboardData || this.dashboardData.monthlyBudget === 0) return 0;
    return Math.min((this.dashboardData.monthlyExpense / this.dashboardData.monthlyBudget) * 100, 100);
  }

  get budgetStatus(): 'good' | 'warning' | 'danger' {
    const percentage = this.budgetPercentage;
    if (percentage <= 70) return 'good';
    if (percentage <= 90) return 'warning';
    return 'danger';
  }
}