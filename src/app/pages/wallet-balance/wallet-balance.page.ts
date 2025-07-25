import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonToast,
  ToastController,
  LoadingController, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  wallet,
  card,
  cash,
  download,
  send,
  trendingUp,
  trendingDown,
  time,
  checkmarkCircle,
  closeCircle,
  alertCircle,
  eye,
  eyeOff,
  refresh,
  statsChart,
  filter,
  calendar,
  search,
  chevronDown,
  chevronUp,
  addCircle,
  removeCircle,
  swapHorizontal,
  qrCode,
  receipt,
  shield,
  informationCircle,
  star,
  gift,
  lockClosed, person, share, 
  checkmark} from 'ionicons/icons';
import { BottomNavbarComponent } from "src/app/components/dashboard/nav-bottom/navbar-bottom.component";

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'bonus' | 'fee' | 'refund' | 'adjustment';
  amount: number;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  relatedOrderId?: string;
  customerName?: string;
  withdrawalBankName?: string;
  withdrawalAccountNumber?: string;
  feeAmount?: number;
  notes?: string;
  icon?: string;
}

interface WithdrawalMethod {
  id: string;
  type: 'bank' | 'ewallet' | 'cash';
  name: string;
  accountNumber: string;
  accountName: string;
  icon: string;
  isActive: boolean;
  minimumAmount: number;
  processingTime: string;
  feeRate: number; // percentage
  feeFixed: number; // fixed amount
}

interface BalanceStats {
  totalBalance: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  availableForWithdrawal: number;
  totalTransactions: number;
  averageDailyEarnings: number;
  lastWithdrawalDate?: string;
}

type TransactionFilter = 'all' | 'earning' | 'withdrawal' | 'bonus' | 'fee';
type DateFilter = 'today' | 'week' | 'month' | 'custom';

@Component({
  selector: 'app-wallet-balance',
  standalone: true,
  imports: [IonToolbar,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast, BottomNavbarComponent],
  templateUrl: './wallet-balance.page.html',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    
    .balance-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .earnings-card {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .withdrawal-card {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .slide-up {
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .7; }
    }
  `]
})
export class WalletBalancePage implements OnInit, OnDestroy {

  // Balance and Stats
  balanceStats: BalanceStats = {
    totalBalance: 2350000,
    todayEarnings: 145000,
    weeklyEarnings: 850000,
    monthlyEarnings: 3200000,
    totalWithdrawn: 15500000,
    pendingWithdrawal: 200000,
    availableForWithdrawal: 2150000, // totalBalance - pendingWithdrawal
    totalTransactions: 156,
    averageDailyEarnings: 125000,
    lastWithdrawalDate: '2024-07-20'
  };

  // Transactions
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  // Withdrawal Methods
  withdrawalMethods: WithdrawalMethod[] = [
    {
      id: '1',
      type: 'bank',
      name: 'BCA',
      accountNumber: '1234567890',
      accountName: 'BUDI SANTOSO',
      icon: 'card',
      isActive: true,
      minimumAmount: 50000,
      processingTime: '1-2 hari kerja',
      feeRate: 0,
      feeFixed: 6500
    },
    {
      id: '2',
      type: 'ewallet',
      name: 'GoPay',
      accountNumber: '081234567890',
      accountName: 'BUDI SANTOSO',
      icon: 'wallet',
      isActive: true,
      minimumAmount: 10000,
      processingTime: 'Instan',
      feeRate: 1.5,
      feeFixed: 0
    },
    {
      id: '3',
      type: 'ewallet',
      name: 'OVO',
      accountNumber: '081234567890',
      accountName: 'BUDI SANTOSO',
      icon: 'wallet',
      isActive: false,
      minimumAmount: 10000,
      processingTime: 'Instan',
      feeRate: 2.0,
      feeFixed: 0
    }
  ];

  // UI State
  showToast = false;
  toastMessage = '';
  isLoading = false;
  showBalance = true;
  showWithdrawalModal = false;
  showTransactionDetail = false;
  showStatsPanel = false;
  
  // Filters
  currentFilter: TransactionFilter = 'all';
  dateFilter: DateFilter = 'month';
  searchTerm = '';
  showAdvancedFilters = false;
  
  // Withdrawal Form
  withdrawalAmount = 0;
  selectedWithdrawalMethod: WithdrawalMethod | null = null;
  withdrawalNote = '';
  
  // Selected Transaction
  selectedTransaction: Transaction | null = null;
  
  // Filter Options
  filterOptions = [
    { value: 'all' as TransactionFilter, label: 'Semua', icon: 'swap-horizontal' },
    { value: 'earning' as TransactionFilter, label: 'Penghasilan', icon: 'trending-up' },
    { value: 'withdrawal' as TransactionFilter, label: 'Penarikan', icon: 'trending-down' },
    { value: 'bonus' as TransactionFilter, label: 'Bonus', icon: 'gift' },
    { value: 'fee' as TransactionFilter, label: 'Biaya', icon: 'remove-circle' }
  ];

  dateFilterOptions = [
    { value: 'today' as DateFilter, label: 'Hari Ini' },
    { value: 'week' as DateFilter, label: '7 Hari' },
    { value: 'month' as DateFilter, label: '30 Hari' },
    { value: 'custom' as DateFilter, label: 'Custom' }
  ];

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({arrowBack,statsChart,refresh,wallet,trendingDown,chevronUp,send,download,qrCode,shield,search,person,receipt,chevronDown,closeCircle,checkmark,share,trendingUp,card,cash,time,checkmarkCircle,alertCircle,eye,eyeOff,filter,calendar,addCircle,removeCircle,swapHorizontal,informationCircle,star,gift,lockClosed});
  }

  ngOnInit() {
    this.loadTransactionHistory();
    this.calculateAvailableBalance();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadTransactionHistory() {
    this.isLoading = true;
    
    // Simulate API call
    await this.delay(1000);
    
    this.transactions = [
      {
        id: '1',
        type: 'earning',
        amount: 82500,
        description: 'Service Motor Honda Vario',
        date: '2024-07-25',
        time: '14:30',
        status: 'completed',
        relatedOrderId: 'ORD-2024-001',
        customerName: 'Andi Susanto'
      },
      {
        id: '2',
        type: 'earning',
        amount: 55000,
        description: 'Tambal Ban Yamaha NMAX',
        date: '2024-07-24',
        time: '10:15',
        status: 'completed',
        relatedOrderId: 'ORD-2024-002',
        customerName: 'Sari Dewi'
      },
      {
        id: '3',
        type: 'withdrawal',
        amount: -500000,
        description: 'Penarikan ke BCA',
        date: '2024-07-24',
        time: '09:00',
        status: 'completed',
        withdrawalBankName: 'BCA',
        withdrawalAccountNumber: '1234567890',
        feeAmount: 6500
      },
      {
        id: '4',
        type: 'earning',
        amount: 128000,
        description: 'Perbaikan Mobil Toyota Avanza',
        date: '2024-07-23',
        time: '16:45',
        status: 'completed',
        relatedOrderId: 'ORD-2024-003',
        customerName: 'Budi Santoso'
      },
      {
        id: '5',
        type: 'bonus',
        amount: 50000,
        description: 'Bonus Rating Sempurna',
        date: '2024-07-23',
        time: '18:00',
        status: 'completed',
        notes: 'Bonus untuk mendapat rating 5 bintang dari 5 customer berturut-turut'
      },
      {
        id: '6',
        type: 'fee',
        amount: -15000,
        description: 'Biaya Platform Bulanan',
        date: '2024-07-22',
        time: '00:01',
        status: 'completed',
        notes: 'Biaya berlangganan platform untuk bulan Juli 2024'
      },
      {
        id: '7',
        type: 'withdrawal',
        amount: -200000,
        description: 'Penarikan ke GoPay',
        date: '2024-07-21',
        time: '15:30',
        status: 'pending',
        withdrawalBankName: 'GoPay',
        withdrawalAccountNumber: '081234567890',
        feeAmount: 3000
      },
      {
        id: '8',
        type: 'earning',
        amount: 110500,
        description: 'Ganti Rantai Motor Kawasaki',
        date: '2024-07-20',
        time: '11:30',
        status: 'completed',
        relatedOrderId: 'ORD-2024-006',
        customerName: 'Ahmad Rizki'
      },
      {
        id: '9',
        type: 'refund',
        amount: 75000,
        description: 'Refund Order Dibatalkan',
        date: '2024-07-19',
        time: '14:20',
        status: 'completed',
        relatedOrderId: 'ORD-2024-004',
        customerName: 'Lisa Permata',
        notes: 'Customer membatalkan order setelah montir dalam perjalanan'
      },
      {
        id: '10',
        type: 'earning',
        amount: 95000,
        description: 'Service Berkala Motor Beat',
        date: '2024-07-19',
        time: '10:45',
        status: 'completed',
        relatedOrderId: 'ORD-2024-007',
        customerName: 'Maya Sari'
      }
    ];
    
    this.isLoading = false;
    this.applyFilters();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculateAvailableBalance() {
    this.balanceStats.availableForWithdrawal = 
      this.balanceStats.totalBalance - this.balanceStats.pendingWithdrawal;
  }

  // Filter and Search Methods
  applyFilters() {
    let filtered = [...this.transactions];
    
    // Type filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(t => t.type === this.currentFilter);
    }
    
    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) ||
        t.customerName?.toLowerCase().includes(term) ||
        t.relatedOrderId?.toLowerCase().includes(term)
      );
    }
    
    // Date filter
    filtered = this.applyDateFilter(filtered);
    
    this.filteredTransactions = filtered;
  }

  private applyDateFilter(transactions: Transaction[]): Transaction[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (this.dateFilter) {
      case 'today':
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= today;
        });
        
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= weekAgo;
        });
        
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= monthAgo;
        });
        
      default:
        return transactions;
    }
  }

  setFilter(filter: TransactionFilter) {
    this.currentFilter = filter;
    this.applyFilters();
  }

  setDateFilter(filter: DateFilter) {
    this.dateFilter = filter;
    this.applyFilters();
  }

  // Balance Display Methods
  toggleBalanceVisibility() {
    this.showBalance = !this.showBalance;
    this.showToastMessage(this.showBalance ? 'Saldo ditampilkan' : 'Saldo disembunyikan');
  }

  toggleStatsPanel() {
    this.showStatsPanel = !this.showStatsPanel;
  }

  // Transaction Methods
  getTransactionIcon(transaction: Transaction): string {
    switch (transaction.type) {
      case 'earning': return 'trending-up';
      case 'withdrawal': return 'trending-down';
      case 'bonus': return 'gift';
      case 'fee': return 'remove-circle';
      case 'refund': return 'refresh';
      case 'adjustment': return 'swap-horizontal';
      default: return 'wallet';
    }
  }

  getTransactionColor(transaction: Transaction): string {
    switch (transaction.type) {
      case 'earning':
      case 'bonus':
      case 'refund':
        return 'text-green-600';
      case 'withdrawal':
      case 'fee':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  }

  getTransactionBgColor(transaction: Transaction): string {
    switch (transaction.type) {
      case 'earning':
      case 'bonus':
      case 'refund':
        return 'bg-green-100';
      case 'withdrawal':
      case 'fee':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Berhasil';
      case 'pending': return 'Menunggu';
      case 'failed': return 'Gagal';
      case 'cancelled': return 'Dibatalkan';
      default: return 'Unknown';
    }
  }

  viewTransactionDetail(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.showTransactionDetail = true;
  }

  closeTransactionDetail() {
    this.showTransactionDetail = false;
    this.selectedTransaction = null;
  }

  // Withdrawal Methods
  openWithdrawalModal() {
    if (this.balanceStats.availableForWithdrawal < 10000) {
      this.showToastMessage('Saldo minimum untuk penarikan adalah Rp 10.000');
      return;
    }
    this.showWithdrawalModal = true;
  }

  closeWithdrawalModal() {
    this.showWithdrawalModal = false;
    this.withdrawalAmount = 0;
    this.selectedWithdrawalMethod = null;
    this.withdrawalNote = '';
  }

  selectWithdrawalMethod(method: WithdrawalMethod) {
    this.selectedWithdrawalMethod = method;
  }

  calculateWithdrawalFee(): number {
    if (!this.selectedWithdrawalMethod) return 0;
    
    const percentageFee = (this.withdrawalAmount * this.selectedWithdrawalMethod.feeRate) / 100;
    return percentageFee + this.selectedWithdrawalMethod.feeFixed;
  }

  getWithdrawalNetAmount(): number {
    return this.withdrawalAmount - this.calculateWithdrawalFee();
  }

  canProceedWithdrawal(): boolean {
    return this.selectedWithdrawalMethod !== null &&
           this.withdrawalAmount >= this.selectedWithdrawalMethod.minimumAmount &&
           this.withdrawalAmount <= this.balanceStats.availableForWithdrawal;
  }

  async processWithdrawal() {
    if (!this.canProceedWithdrawal()) return;

    const loading = await this.loadingController.create({
      message: 'Memproses penarikan...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Simulate API call
      await this.delay(2000);

      // Create withdrawal transaction
      const withdrawalTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: -this.withdrawalAmount,
        description: `Penarikan ke ${this.selectedWithdrawalMethod!.name}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: this.selectedWithdrawalMethod!.type === 'ewallet' ? 'completed' : 'pending',
        withdrawalBankName: this.selectedWithdrawalMethod!.name,
        withdrawalAccountNumber: this.selectedWithdrawalMethod!.accountNumber,
        feeAmount: this.calculateWithdrawalFee(),
        notes: this.withdrawalNote
      };

      // Add transaction to list
      this.transactions.unshift(withdrawalTransaction);
      
      // Update balance
      this.balanceStats.totalBalance -= this.withdrawalAmount;
      if (withdrawalTransaction.status === 'pending') {
        this.balanceStats.pendingWithdrawal += this.withdrawalAmount;
      } else {
        this.balanceStats.totalWithdrawn += this.withdrawalAmount;
      }
      this.calculateAvailableBalance();

      await loading.dismiss();
      this.closeWithdrawalModal();
      this.applyFilters();
      
      this.showToastMessage(
        withdrawalTransaction.status === 'completed' 
          ? 'Penarikan berhasil diproses!' 
          : 'Penarikan sedang diproses, akan masuk dalam 1-2 hari kerja'
      );

    } catch (error) {
      await loading.dismiss();
      this.showToastMessage('Gagal memproses penarikan. Silahkan coba lagi.');
    }
  }

  // Utility Methods
  async refreshData() {
    const loading = await this.loadingController.create({
      message: 'Memperbarui data...',
      spinner: 'crescent'
    });
    await loading.present();
    
    await this.loadTransactionHistory();
    await loading.dismiss();
    this.showToastMessage('Data berhasil diperbarui');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(Math.abs(amount));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }

  trackByTransactionId(index: number, transaction: Transaction): string {
    return transaction.id;
  }

  goBack() {
    this.showToastMessage('Kembali ke halaman sebelumnya');
  }

  exportStatement() {
    this.showToastMessage('Mengekspor laporan keuangan...');
  }

  contactSupport() {
    this.showToastMessage('Menghubungi customer support...');
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
}