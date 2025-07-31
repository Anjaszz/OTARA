import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonToast,
  ToastController,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  search,
  filter,
  calendar,
  star,
  checkmarkCircle,
  closeCircle,
  time,
  location,
  car,
  person,
  wallet,
  chatbubble,
  call,
  refresh,
  chevronDown,
  chevronUp,
  document,
  camera,
  download,
  share,
  statsChart,
  eye,
  heart,
  thumbsUp,
  alertCircle, options, card, addCircle } from 'ionicons/icons';
import { BottomNavbarComponent } from "src/app/components/dashboard/nav-bottom/navbar-bottom.component";
import { Router } from '@angular/router';

interface OrderHistory {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  customerName: string;
  customerRating: number;
  customerPhoto?: string;
  vehicleType: string;
  vehicleInfo: string;
  vehiclePlate: string;
  problem: string;
  solution?: string;
  location: string;
  distance: number;
  duration: string;
  actualDuration?: string;
  status: 'completed' | 'cancelled' | 'rejected' | 'in-progress';
  cancelReason?: string;
  fee: number;
  tip: number;
  platformFee: number;
  totalEarning: number;
  rating: number;
  customerReview?: string;
  photos?: string[];
  paymentMethod: string;
  responseTime?: string;
  completionTime?: string;
  isRepeatingCustomer?: boolean;
  weatherCondition?: string;
  emergencyService?: boolean;
}

interface DateRange {
  label: string;
  from: string;
  to: string;
}

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  rejectedOrders: number;
  totalEarnings: number;
  averageRating: number;
  averageOrderValue: number;
  responseTime: string;
  completionRate: number;
  customerSatisfaction: number;
}

type FilterStatus = 'all' | 'completed' | 'cancelled' | 'rejected' | 'in-progress';
type SortBy = 'date' | 'earning' | 'rating' | 'duration' | 'distance';

@Component({
  selector: 'app-history-order',
  templateUrl: './history-order.page.html',
  styleUrls: ['./history-order.page.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast,
    BottomNavbarComponent
],
})
export class HistoryOrderPage implements OnInit, OnDestroy {

  // Data
  orders: OrderHistory[] = [];
  filteredOrders: OrderHistory[] = [];
  expandedOrders: Set<string> = new Set();
  favoriteOrders: Set<string> = new Set();
  
  // Filters & Search
  searchTerm = '';
  currentFilter: FilterStatus = 'all';
  sortBy: SortBy = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  dateFrom = '';
  dateTo = '';
  showDateFilter = false;
  showAdvancedFilters = false;
  
  // Advanced Filters
  minEarning = 0;
  maxEarning = 1000000;
  selectedVehicleTypes: string[] = [];
  selectedPaymentMethods: string[] = [];
  minRating = 0;
  onlyRepeatingCustomers = false;
  onlyEmergencyServices = false;
  
  // UI State
  showToast = false;
  toastMessage = '';
  hasMoreData = true;
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  showStats = false;
  
  // Quick date ranges
  quickDateRanges: DateRange[] = [
    { label: 'Hari Ini', from: this.getDateString(0), to: this.getDateString(0) },
    { label: '7 Hari Terakhir', from: this.getDateString(-7), to: this.getDateString(0) },
    { label: '30 Hari Terakhir', from: this.getDateString(-30), to: this.getDateString(0) },
    { label: 'Bulan Ini', from: this.getFirstDayOfMonth(), to: this.getDateString(0) },
    { label: 'Bulan Lalu', from: this.getFirstDayOfLastMonth(), to: this.getLastDayOfLastMonth() }
  ];
  
  filterOptions = [
    { value: 'all' as FilterStatus, label: 'Semua', icon: 'document' },
    { value: 'completed' as FilterStatus, label: 'Selesai', icon: 'checkmark-circle' },
    { value: 'in-progress' as FilterStatus, label: 'Berlangsung', icon: 'time' },
    { value: 'cancelled' as FilterStatus, label: 'Batal', icon: 'close-circle' },
    { value: 'rejected' as FilterStatus, label: 'Ditolak', icon: 'alert-circle' }
  ];

  vehicleTypes = ['Motor', 'Mobil', 'Truk', 'Bus'];
  paymentMethods = ['Cash', 'Digital Wallet', 'Transfer Bank', 'Credit Card'];

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    addIcons({arrowBack,statsChart,refresh,chevronUp,filter,search,closeCircle,calendar,options,wallet,person,car,card,location,star,checkmarkCircle,alertCircle,camera,eye,call,share,download,addCircle,time,chatbubble,chevronDown,document,heart,thumbsUp});
  }

  ngOnInit() {
    this.loadOrderHistory();
    this.loadFavorites();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadOrderHistory() {
    this.isLoading = true;
    
    // Simulate API call with more comprehensive dummy data
    await this.delay(1000);
    
    this.orders = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: '2024-07-25',
        time: '14:30',
        customerName: 'Andi Susanto',
        customerRating: 4.5,
        vehicleType: 'Motor',
        vehicleInfo: 'Honda Vario 150',
        vehiclePlate: 'B 1234 ABC',
        problem: 'Motor tidak mau hidup, kemungkinan masalah di aki atau starter',
        solution: 'Mengganti aki yang sudah soak dan membersihkan terminal aki',
        location: 'Jl. Sudirman No. 123, Jakarta Pusat',
        distance: 2.5,
        duration: '45 menit',
        actualDuration: '42 menit',
        status: 'completed',
        fee: 75000,
        tip: 15000,
        platformFee: 7500,
        totalEarning: 82500,
        rating: 5,
        customerReview: 'Montir sangat profesional dan cepat menyelesaikan masalah. Terima kasih!',
        photos: ['photo1.jpg', 'photo2.jpg'],
        paymentMethod: 'Cash',
        responseTime: '3 menit',
        completionTime: '47 menit',
        isRepeatingCustomer: false,
        weatherCondition: 'Cerah',
        emergencyService: true
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        date: '2024-07-24',
        time: '10:15',
        customerName: 'Sari Dewi',
        customerRating: 4.2,
        vehicleType: 'Motor',
        vehicleInfo: 'Yamaha NMAX',
        vehiclePlate: 'B 5678 DEF',
        problem: 'Ban bocor, butuh ganti ban atau tambal',
        solution: 'Tambal ban tubeless dan cek tekanan angin',
        location: 'Jl. Thamrin No. 45, Jakarta Pusat',
        distance: 1.8,
        duration: '30 menit',
        actualDuration: '28 menit',
        status: 'completed',
        fee: 50000,
        tip: 10000,
        platformFee: 5000,
        totalEarning: 55000,
        rating: 4,
        customerReview: 'Pelayanan baik, harga sesuai',
        photos: ['photo3.jpg'],
        paymentMethod: 'Digital Wallet',
        responseTime: '5 menit',
        completionTime: '35 menit',
        isRepeatingCustomer: true,
        weatherCondition: 'Berawan'
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        date: '2024-07-24',
        time: '16:45',
        customerName: 'Budi Santoso',
        customerRating: 4.0,
        vehicleType: 'Mobil',
        vehicleInfo: 'Toyota Avanza',
        vehiclePlate: 'B 9012 GHI',
        problem: 'Mesin overheat, keluar asap putih dari knalpot',
        solution: 'Ganti coolant dan perbaiki kebocoran radiator',
        location: 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
        distance: 3.2,
        duration: '1 jam 15 menit',
        actualDuration: '1 jam 20 menit',
        status: 'completed',
        fee: 120000,
        tip: 20000,
        platformFee: 12000,
        totalEarning: 128000,
        rating: 5,
        customerReview: 'Sangat membantu dan menjelaskan masalah dengan detail',
        photos: ['photo4.jpg', 'photo5.jpg', 'photo6.jpg'],
        paymentMethod: 'Transfer Bank',
        responseTime: '7 menit',
        completionTime: '1 jam 27 menit',
        isRepeatingCustomer: false,
        weatherCondition: 'Hujan Ringan'
      },
      {
        id: '4',
        orderNumber: 'ORD-2024-004',
        date: '2024-07-23',
        time: '09:20',
        customerName: 'Lisa Permata',
        customerRating: 4.8,
        vehicleType: 'Motor',
        vehicleInfo: 'Honda Beat',
        vehiclePlate: 'B 3456 JKL',
        problem: 'Motor susah distarter, kadang mau kadang tidak',
        location: 'Jl. Kuningan No. 67, Jakarta Selatan',
        distance: 4.1,
        duration: '50 menit',
        status: 'cancelled',
        cancelReason: 'Customer membatalkan setelah menemukan bengkel terdekat',
        fee: 0,
        tip: 0,
        platformFee: 0,
        totalEarning: 0,
        rating: 0,
        paymentMethod: '-',
        responseTime: '4 menit',
        weatherCondition: 'Cerah'
      },
      {
        id: '5',
        orderNumber: 'ORD-2024-005',
        date: '2024-07-23',
        time: '13:10',
        customerName: 'Rahman Hakim',
        customerRating: 3.9,
        vehicleType: 'Motor',
        vehicleInfo: 'Suzuki GSX',
        vehiclePlate: 'B 7890 MNO',
        problem: 'Rem blong, tidak bisa berhenti dengan baik',
        location: 'Jl. Casablanca No. 12, Jakarta Selatan',
        distance: 2.9,
        duration: '40 menit',
        status: 'rejected',
        fee: 0,
        tip: 0,
        platformFee: 0,
        totalEarning: 0,
        rating: 0,
        paymentMethod: '-',
        responseTime: '2 menit',
        weatherCondition: 'Berawan'
      },
      {
        id: '6',
        orderNumber: 'ORD-2024-006',
        date: '2024-07-22',
        time: '11:30',
        customerName: 'Ahmad Rizki',
        customerRating: 4.6,
        vehicleType: 'Motor',
        vehicleInfo: 'Kawasaki Ninja',
        vehiclePlate: 'B 1357 PQR',
        problem: 'Rantai motor putus, tidak bisa jalan',
        solution: 'Ganti rantai motor dan setel ulang',
        location: 'Jl. Kemang Raya No. 77, Jakarta Selatan',
        distance: 4.5,
        duration: '1 jam',
        actualDuration: '55 menit',
        status: 'completed',
        fee: 95000,
        tip: 25000,
        platformFee: 9500,
        totalEarning: 110500,
        rating: 5,
        customerReview: 'Montir handal, kerja cepat dan rapi!',
        photos: ['photo7.jpg', 'photo8.jpg'],
        paymentMethod: 'Digital Wallet',
        responseTime: '6 menit',
        completionTime: '1 jam 6 menit',
        isRepeatingCustomer: false,
        weatherCondition: 'Cerah',
        emergencyService: false
      }
    ];
    
    this.filteredOrders = [...this.orders];
    this.isLoading = false;
    this.applyFilters();
  }

  // Helper methods for date ranges
  private getDateString(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  }

  private getFirstDayOfMonth(): string {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  }

  private getFirstDayOfLastMonth(): string {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString().split('T')[0];
  }

  private getLastDayOfLastMonth(): string {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 0).toISOString().split('T')[0];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  applyFilters() {
    let filtered = [...this.orders];
    
    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(term) ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.vehicleInfo.toLowerCase().includes(term) ||
        order.vehiclePlate.toLowerCase().includes(term) ||
        order.problem.toLowerCase().includes(term) ||
        order.location.toLowerCase().includes(term)
      );
    }
    
    // Status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(order => order.status === this.currentFilter);
    }
    
    // Date filter
    if (this.dateFrom) {
      filtered = filtered.filter(order => order.date >= this.dateFrom);
    }
    if (this.dateTo) {
      filtered = filtered.filter(order => order.date <= this.dateTo);
    }
    
    // Advanced filters
    if (this.minEarning > 0) {
      filtered = filtered.filter(order => order.totalEarning >= this.minEarning);
    }
    if (this.maxEarning < 1000000) {
      filtered = filtered.filter(order => order.totalEarning <= this.maxEarning);
    }
    if (this.selectedVehicleTypes.length > 0) {
      filtered = filtered.filter(order => this.selectedVehicleTypes.includes(order.vehicleType));
    }
    if (this.selectedPaymentMethods.length > 0) {
      filtered = filtered.filter(order => this.selectedPaymentMethods.includes(order.paymentMethod));
    }
    if (this.minRating > 0) {
      filtered = filtered.filter(order => order.rating >= this.minRating);
    }
    if (this.onlyRepeatingCustomers) {
      filtered = filtered.filter(order => order.isRepeatingCustomer);
    }
    if (this.onlyEmergencyServices) {
      filtered = filtered.filter(order => order.emergencyService);
    }
    
    this.filteredOrders = filtered;
    this.sortOrders();
  }

  setFilter(status: FilterStatus) {
    this.currentFilter = status;
    this.applyFilters();
  }

  sortOrders() {
    this.filteredOrders.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'date':
          comparison = new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
          break;
        case 'earning':
          comparison = a.totalEarning - b.totalEarning;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'duration':
          comparison = this.parseDuration(a.duration) - this.parseDuration(b.duration);
          break;
        case 'distance':
          comparison = a.distance - b.distance;
          break;
      }
      
      return this.sortDirection === 'desc' ? -comparison : comparison;
    });
  }

  private parseDuration(duration: string): number {
    // Convert duration string to minutes for comparison
    const parts = duration.split(' ');
    let minutes = 0;
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].includes('jam')) {
        minutes += parseInt(parts[i-1] || '0') * 60;
      }
      if (parts[i].includes('menit')) {
        minutes += parseInt(parts[i-1] || '0');
      }
    }
    
    return minutes;
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    this.sortOrders();
  }

  setQuickDateRange(range: DateRange) {
    this.dateFrom = range.from;
    this.dateTo = range.to;
    this.applyFilters();
    this.showToastMessage(`Filter diterapkan: ${range.label}`);
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.currentFilter = 'all';
    this.dateFrom = '';
    this.dateTo = '';
    this.minEarning = 0;
    this.maxEarning = 1000000;
    this.selectedVehicleTypes = [];
    this.selectedPaymentMethods = [];
    this.minRating = 0;
    this.onlyRepeatingCustomers = false;
    this.onlyEmergencyServices = false;
    this.applyFilters();
    this.showToastMessage('Semua filter dihapus');
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  toggleDateFilter() {
    this.showDateFilter = !this.showDateFilter;
  }

  toggleStats() {
    this.showStats = !this.showStats;
  }

  // Statistics calculations
  getOrderStats(): OrderStats {
    const completed = this.orders.filter(o => o.status === 'completed');
    const totalEarnings = completed.reduce((sum, o) => sum + o.totalEarning, 0);
    const totalRating = completed.reduce((sum, o) => sum + o.rating, 0);
    const avgOrderValue = completed.length > 0 ? totalEarnings / completed.length : 0;
    const avgRating = completed.length > 0 ? totalRating / completed.length : 0;
    const completionRate = this.orders.length > 0 ? (completed.length / this.orders.length) * 100 : 0;
    const satisfaction = completed.filter(o => o.rating >= 4).length;
    const customerSatisfaction = completed.length > 0 ? (satisfaction / completed.length) * 100 : 0;
    
    return {
      totalOrders: this.orders.length,
      completedOrders: completed.length,
      cancelledOrders: this.orders.filter(o => o.status === 'cancelled').length,
      rejectedOrders: this.orders.filter(o => o.status === 'rejected').length,
      totalEarnings,
      averageRating: Math.round(avgRating * 10) / 10,
      averageOrderValue: Math.round(avgOrderValue),
      responseTime: '4.2 menit',
      completionRate: Math.round(completionRate),
      customerSatisfaction: Math.round(customerSatisfaction)
    };
  }

  getCountByStatus(status: FilterStatus): number {
    if (status === 'all') return this.orders.length;
    return this.orders.filter(order => order.status === status).length;
  }

  getTotalEarnings(): number {
    return this.orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.totalEarning, 0);
  }

  getAverageRating(): number {
    const completedOrders = this.orders.filter(order => order.status === 'completed' && order.rating > 0);
    if (completedOrders.length === 0) return 0;
    
    const totalRating = completedOrders.reduce((total, order) => total + order.rating, 0);
    return Math.round((totalRating / completedOrders.length) * 10) / 10;
  }

  // UI helper methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      case 'rejected': return 'Ditolak';
      case 'in-progress': return 'Berlangsung';
      default: return 'Unknown';
    }
  }

  get dateFilterLabel(): string {
    if (this.dateFrom && this.dateTo) {
      if (this.dateFrom === this.dateTo) {
        return `${this.formatDate(this.dateFrom)}`;
      }
      return `${this.formatDate(this.dateFrom)} - ${this.formatDate(this.dateTo)}`;
    }
    if (this.dateFrom) return `Dari ${this.formatDate(this.dateFrom)}`;
    if (this.dateTo) return `Sampai ${this.formatDate(this.dateTo)}`;
    return 'Pilih Tanggal';
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      year: '2-digit'
    });
  }

  roundNumber(value: number): number {
    return Math.round(value);
  }

  // Order detail methods
  toggleOrderDetail(orderId: string) {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrders.has(orderId);
  }

  toggleFavorite(orderId: string) {
    if (this.favoriteOrders.has(orderId)) {
      this.favoriteOrders.delete(orderId);
      this.showToastMessage('Dihapus dari favorit');
    } else {
      this.favoriteOrders.add(orderId);
      this.showToastMessage('Ditambahkan ke favorit');
    }
    this.saveFavorites();
  }

  isFavorite(orderId: string): boolean {
    return this.favoriteOrders.has(orderId);
  }

  private loadFavorites() {
    const saved = localStorage.getItem('favoriteOrders');
    if (saved) {
      this.favoriteOrders = new Set(JSON.parse(saved));
    }
  }

  private saveFavorites() {
    localStorage.setItem('favoriteOrders', JSON.stringify([...this.favoriteOrders]));
  }

  // Action methods
  contactCustomer(order: OrderHistory) {
    this.showToastMessage(`Menghubungi ${order.customerName}...`);
  }

  viewOrderDetail(order: OrderHistory) {
    this.showToastMessage(`Membuka detail order ${order.orderNumber}`);
  }

  shareOrder(order: OrderHistory) {
    this.showToastMessage(`Membagikan order ${order.orderNumber}`);
  }

  downloadReceipt(order: OrderHistory) {
    this.showToastMessage(`Mengunduh kwitansi ${order.orderNumber}`);
  }

  repeatOrder(order: OrderHistory) {
    this.showToastMessage(`Mengulangi order untuk ${order.customerName}`);
  }

  getEmptyStateMessage(): string {
    if (this.searchTerm) {
      return `Tidak ditemukan order dengan pencarian "${this.searchTerm}"`;
    }
    if (this.currentFilter !== 'all') {
      return `Tidak ada order dengan status ${this.getStatusLabel(this.currentFilter)}`;
    }
    if (this.dateFrom || this.dateTo) {
      return 'Tidak ada order pada rentang tanggal yang dipilih';
    }
    return 'Belum ada riwayat order. Mulai bekerja untuk melihat riwayat order di sini.';
  }

  trackByOrderId(index: number, order: OrderHistory): string {
    return order.id;
  }

  // Navigation and utility methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  async refreshData() {
    const loading = await this.loadingController.create({
      message: 'Memperbarui data...',
      spinner: 'crescent'
    });
    await loading.present();
    
    await this.loadOrderHistory();
    await loading.dismiss();
    this.showToastMessage('Data berhasil diperbarui');
  }

  async loadMore() {
    if (!this.hasMoreData) return;
    
    this.isLoading = true;
    await this.delay(1000);
    
    // Simulate loading more data
    this.currentPage++;
    this.hasMoreData = this.currentPage < 3; // Limit for demo
    this.isLoading = false;
    
    this.showToastMessage('Data tambahan dimuat');
  }

  // Format utilities
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
  }

  formatPercentage(value: number): string {
    return `${value}%`;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  exportData() {
    this.showToastMessage('Mengekspor data riwayat order...');
    // In real app: generate and download CSV/PDF report
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
}