import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mail,
  location,
  storefront,
  logOut,
  logoWhatsapp,
  logoFacebook,
  logoInstagram,
  checkmarkCircle,
  checkmark,
  createOutline,
  cube,
  trendingUp
} from 'ionicons/icons';
import { BottomNavbarComponent } from "src/app/components/dashboard/nav-bottom/navbar-bottom.component";
import { SellerService, SellerProfile } from '../../../services/seller.service';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonAvatar,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    BottomNavbarComponent
  ],
  templateUrl: './seller-profile.page.html',
  styleUrls: ['./seller-profile.page.scss']
})
export class SellerProfilePage implements OnInit {
  seller: SellerProfile | null = null;
  totalProducts = 0;
  isLoading = false;
  isLoggingOut = false;

  stats = {
    totalSales: 0,
    revenue: 0,
    rating: 0
  };

  constructor(
    private router: Router,
    private sellerService: SellerService,
    private authService: AuthService,
    private productService: ProductService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      mail,
      location,
      storefront,
      logOut,
      logoWhatsapp,
      logoFacebook,
      logoInstagram,
      checkmarkCircle,
      checkmark,
      createOutline,
      cube,
      trendingUp
    });
  }

  ngOnInit() {
    this.loadSellerProfile();
    this.loadProductStats();
  }

  loadSellerProfile() {
    this.isLoading = true;
    this.sellerService.getSellerProfile().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.seller = response.data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading seller profile:', error);
        this.showToast('Gagal memuat profil', 'danger');
      }
    });
  }

  loadProductStats() {
    this.productService.getSellerProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.totalProducts = response.count || 0;
        }
      },
      error: (error) => {
        console.error('Error loading product stats:', error);
      }
    });
  }

  editProfile() {
    this.router.navigate(['/edit-seller-profile']);
  }

  viewSales() {
    console.log('View sales');
    this.showToast('Fitur riwayat penjualan akan segera hadir', 'warning');
  }

  viewWallet() {
    console.log('View wallet');
    this.showToast('Fitur dompet akan segera hadir', 'warning');
  }

  openSettings() {
    console.log('Open settings');
    this.showToast('Fitur pengaturan akan segera hadir', 'warning');
  }

  openHelp() {
    console.log('Open help');
    this.showToast('Fitur bantuan akan segera hadir', 'warning');
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Keluar',
          role: 'destructive',
          handler: () => {
            this.confirmLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  confirmLogout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe({
      next: (response) => {
        this.isLoggingOut = false;
        this.showToast('Logout berhasil', 'success');
        setTimeout(() => {
          this.router.navigate(['/masuk']);
        }, 500);
      },
      error: (error) => {
        this.isLoggingOut = false;
        console.error('Logout error:', error);
        // Even if API fails, clear local auth and redirect
        this.showToast('Logout berhasil', 'success');
        setTimeout(() => {
          this.router.navigate(['/masuk']);
        }, 500);
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
