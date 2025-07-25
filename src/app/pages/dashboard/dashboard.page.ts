import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonToast,
  ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  power,
  wallet,
  star,
  time,
  wifi,
  call,
  chatbubble,
  location,
  car,
  person,
  checkmarkCircle,
  closeCircle,
  notifications,
  menu,
  settings,
  help,
  refresh
} from 'ionicons/icons';
import { ConfirmProsesModalComponent } from "src/app/components/modalbox/confirm-proses-modal/confirm-proses-modal.component";
import { BottomNavbarComponent } from "src/app/components/dashboard/nav-bottom/navbar-bottom.component";

interface Order {
  id: string;
  customerName: string;
  customerRating: number;
  problem: string;
  location: string;
  distance: number;
  estimatedTime: string;
  fee: number;
  vehicleType: string;
  vehicleInfo: string;
  customerPhoto: string;
  createdAt: Date;
}

interface DashboardStats {
  todayEarnings: number;
  completedJobs: number;
  averageRating: number;
  onlineHours: number;
  currentBalance: number;
  totalJobsToday: number;
  weeklyEarnings: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast,
    ConfirmProsesModalComponent,
    BottomNavbarComponent
],
  templateUrl: './dashboard.page.html',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    
    .pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
    
    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardPage implements OnInit, OnDestroy {
  
  // Status data
  isOnline = false; // Start with offline
  stats: DashboardStats = {
    todayEarnings: 0,
    completedJobs: 0,
    averageRating: 0,
    onlineHours: 0,
    currentBalance: 1250000, // Previous balance
    totalJobsToday: 0,
    weeklyEarnings: 850000
  };

  // Toast
  showToast = false;
  toastMessage = '';

  // Active order
  activeOrder: Order | null = null;

  // Incoming orders
  incomingOrders: Order[] = [];

  // Timer for online duration
  private onlineTimer: any;
  private orderSimulationTimer: any;
  private onlineStartTime: Date | null = null;

  // Sample orders for simulation
  private sampleOrders: Omit<Order, 'id' | 'createdAt'>[] = [
    {
      customerName: 'Budi Santoso',
      customerRating: 4.3,
      problem: 'Mesin overheat, keluar asap putih dari knalpot',
      location: 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
      distance: 3.2,
      estimatedTime: '12 menit',
      fee: 85000,
      vehicleType: 'Motor',
      vehicleInfo: 'Yamaha Mio - Biru (B 9876 GHI)',
      customerPhoto: ''
    },
    {
      customerName: 'Sari Dewi',
      customerRating: 4.2,
      problem: 'Ban bocor, butuh ganti ban atau tambal',
      location: 'Jl. Thamrin No. 45, Jakarta Pusat',
      distance: 1.8,
      estimatedTime: '6 menit',
      fee: 50000,
      vehicleType: 'Motor',
      vehicleInfo: 'Yamaha NMAX - Hitam (B 5678 DEF)',
      customerPhoto: ''
    },
    {
      customerName: 'Ahmad Rahman',
      customerRating: 4.7,
      problem: 'Susah starter, kemungkinan aki soak',
      location: 'Jl. Kuningan Raya No. 12, Jakarta Selatan',
      distance: 2.1,
      estimatedTime: '9 menit',
      fee: 60000,
      vehicleType: 'Motor',
      vehicleInfo: 'Honda Beat - Putih (B 2468 JKL)',
      customerPhoto: ''
    },
    {
      customerName: 'Lisa Permata',
      customerRating: 4.5,
      problem: 'Rantai motor putus, tidak bisa jalan',
      location: 'Jl. Kemang Raya No. 77, Jakarta Selatan',
      distance: 4.5,
      estimatedTime: '15 menit',
      fee: 95000,
      vehicleType: 'Motor',
      vehicleInfo: 'Kawasaki Ninja - Hijau (B 1357 MNO)',
      customerPhoto: ''
    }
  ];

  constructor(private toastController: ToastController) {
    // Add icons
    addIcons({
      power,
      wallet,
      star,
      time,
      wifi,
      call,
      chatbubble,
      location,
      car,
      person,
      checkmarkCircle,
      closeCircle,
      notifications,
      menu,
      settings,
      help,
      refresh
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  private loadInitialData() {
    // Load previous session data (in real app, this would come from API/storage)
    const savedStats = this.loadStatsFromStorage();
    if (savedStats) {
      this.stats = { ...this.stats, ...savedStats };
    }
    
    // Check if it's a new day and reset daily stats
    this.checkAndResetDailyStats();
  }

  private loadStatsFromStorage(): Partial<DashboardStats> | null {
    // Simulate loading from local storage
    // In real app: return JSON.parse(localStorage.getItem('dashboardStats') || 'null');
    return null;
  }

  private checkAndResetDailyStats() {
    const lastResetDate = localStorage.getItem('lastStatsReset');
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
      // Reset daily stats for new day
      this.stats.todayEarnings = 0;
      this.stats.completedJobs = 0;
      this.stats.onlineHours = 0;
      this.stats.totalJobsToday = 0;
      localStorage.setItem('lastStatsReset', today);
    }
  }

  toggleStatus() {
    this.isOnline = !this.isOnline;
    
    if (this.isOnline) {
      this.goOnline();
    } else {
      this.goOffline();
    }
  }

  private goOnline() {
    this.onlineStartTime = new Date();
    this.showToastMessage('Status Online - Siap menerima order');
    
    // Start online timer
    this.onlineTimer = setInterval(() => {
      this.updateOnlineHours();
    }, 60000); // Update every minute
    
    // Start order simulation
    this.startOrderSimulation();
  }

  private goOffline() {
    this.showToastMessage('Status Offline - Tidak menerima order');
    
    // Update final online hours
    this.updateOnlineHours();
    this.onlineStartTime = null;
    
    // Clear all orders and timers
    this.incomingOrders = [];
    this.clearTimers();
  }

  private updateOnlineHours() {
    if (this.onlineStartTime) {
      const now = new Date();
      const diffMs = now.getTime() - this.onlineStartTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      this.stats.onlineHours = Math.round(diffHours * 10) / 10; // Round to 1 decimal
    }
  }

  private clearTimers() {
    if (this.onlineTimer) {
      clearInterval(this.onlineTimer);
      this.onlineTimer = null;
    }
    if (this.orderSimulationTimer) {
      clearTimeout(this.orderSimulationTimer);
      this.orderSimulationTimer = null;
    }
  }

  private startOrderSimulation() {
    if (!this.isOnline || this.activeOrder) return;

    // Random delay between 20-60 seconds for new orders
    const delay = 10000;
    
    this.orderSimulationTimer = setTimeout(() => {
      if (this.isOnline && !this.activeOrder && this.incomingOrders.length < 2) {
        this.generateNewOrder();
      }
      this.startOrderSimulation(); // Continue simulation
    }, delay);
  }

  private generateNewOrder() {
    if (this.sampleOrders.length === 0) return;
    
    const randomOrder = this.sampleOrders[Math.floor(Math.random() * this.sampleOrders.length)];
    const newOrder: Order = {
      ...randomOrder,
      id: Date.now().toString(),
      createdAt: new Date(),
      // Add some randomness to make it more realistic
      fee: randomOrder.fee + Math.floor(Math.random() * 20000 - 10000),
      distance: Math.round((randomOrder.distance + Math.random() * 2 - 1) * 10) / 10
    };
    
    this.incomingOrders.push(newOrder);
    this.showToastMessage(`Order baru masuk! ${newOrder.customerName} - Rp ${newOrder.fee.toLocaleString()}`);
  }

  acceptOrder(orderId: string) {
    const orderIndex = this.incomingOrders.findIndex(order => order.id === orderId);
    if (orderIndex >= 0) {
      this.activeOrder = this.incomingOrders[orderIndex];
      this.incomingOrders.splice(orderIndex, 1);
      this.showToastMessage('Order diterima! Menuju lokasi customer...');
      
      // Stop order simulation while having active order
      if (this.orderSimulationTimer) {
        clearTimeout(this.orderSimulationTimer);
        this.orderSimulationTimer = null;
      }
    }
  }

  declineOrder(orderId: string) {
    const orderIndex = this.incomingOrders.findIndex(order => order.id === orderId);
    if (orderIndex >= 0) {
      this.incomingOrders.splice(orderIndex, 1);
      this.showToastMessage('Order ditolak');
    }
  }

  completeOrder() {
    if (this.activeOrder) {
      // Update stats
      this.stats.todayEarnings += this.activeOrder.fee;
      this.stats.completedJobs += 1;
      this.stats.totalJobsToday += 1;
      this.stats.currentBalance += this.activeOrder.fee;
      
      // Recalculate average rating (simplified)
      this.stats.averageRating = Math.round(
        ((this.stats.averageRating * (this.stats.completedJobs - 1)) + 4.8) / this.stats.completedJobs * 10
      ) / 10;
      
      this.showToastMessage(`Order selesai! +Rp ${this.activeOrder.fee.toLocaleString()}`);
      this.activeOrder = null;
      
      // Resume order simulation
      if (this.isOnline) {
        this.startOrderSimulation();
      }
    }
  }

  navigateToLocation() {
    this.showToastMessage('Membuka aplikasi maps...');
    // In real app: open maps with coordinates
  }

  arriveAtLocation() {
    this.showToastMessage('Anda telah tiba di lokasi customer');
    // In real app: update order status
  }

  callCustomer() {
    if (this.activeOrder) {
      this.showToastMessage(`Menelepon ${this.activeOrder.customerName}...`);
      // In real app: initiate phone call
    }
  }

  chatWithCustomer() {
    if (this.activeOrder) {
      this.showToastMessage(`Membuka chat dengan ${this.activeOrder.customerName}...`);
      // In real app: open chat interface
    }
  }

  refreshDashboard() {
    this.showToastMessage('Memperbarui dashboard...');
    // In real app: fetch latest data from API
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  // Getter for dashboard state
  get dashboardState(): 'offline' | 'waiting' | 'has-orders' | 'active-order' {
    if (!this.isOnline) return 'offline';
    if (this.activeOrder) return 'active-order';
    if (this.incomingOrders.length > 0) return 'has-orders';
    return 'waiting';
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
  }

  // Track by function for ngFor performance
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  isModalOpen = false;
  
  // Method untuk membuka modal
  openModal() {
    this.isModalOpen = true;
  }
  
  // Method untuk menutup modal
  closeModal() {
    this.isModalOpen = false;
  }
  
  // Method ketika user konfirmasi
  onConfirmProcess() {
    console.log('User confirmed the process');
    // Lakukan proses yang diperlukan
    this.closeModal();
  }
  
  // Method ketika user cancel
  onCancelProcess() {
    console.log('User cancelled the process');
    this.closeModal();
  }
}