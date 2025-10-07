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
  IonBackButton,
  IonButtons,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  person,
  mail,
  settings,
  help,
  logOut,
  chevronForward,
  checkmarkCircle
} from 'ionicons/icons';
import { BuyerService, BuyerProfile } from '../../../services/buyer.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-buyer-profile',
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
    IonBackButton,
    IonButtons
  ],
  templateUrl: './buyer-profile.page.html',
  styleUrls: ['./buyer-profile.page.scss']
})
export class BuyerProfilePage implements OnInit {
  buyer: BuyerProfile | null = null;
  isLoading = false;
  isLoggingOut = false;

  constructor(
    private router: Router,
    private buyerService: BuyerService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      person,
      mail,
      settings,
      help,
      logOut,
      chevronForward,
      checkmarkCircle
    });
  }

  ngOnInit() {
    this.loadBuyerProfile();
  }

  loadBuyerProfile() {
    this.isLoading = true;
    this.buyerService.getBuyerProfile().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.buyer = response.data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading buyer profile:', error);
        this.showToast('Gagal memuat profil', 'danger');
      }
    });
  }

  editProfile() {
    this.showToast('Fitur edit profil akan segera hadir', 'warning');
  }

  openSettings() {
    this.showToast('Fitur pengaturan akan segera hadir', 'warning');
  }

  openHelp() {
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
