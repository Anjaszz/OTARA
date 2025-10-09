import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  person,
  mail,
  informationCircle,
  checkmarkCircle,
  closeCircle
} from 'ionicons/icons';
import { BuyerService, BuyerProfile } from '../../../services/buyer.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonSpinner
  ]
})
export class EditProfilePage implements OnInit {
  buyer: BuyerProfile | null = null;
  nama: string = '';
  isLoading = false;
  isSaving = false;

  constructor(
    private router: Router,
    private buyerService: BuyerService,
    private toastController: ToastController
  ) {
    addIcons({
      arrowBack,
      person,
      mail,
      informationCircle,
      checkmarkCircle,
      closeCircle
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
          this.nama = response.data.nama;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading buyer profile:', error);
        this.showToast('Gagal memuat profil', 'danger');
      }
    });
  }

  goBack() {
    this.router.navigate(['/buyer/profile']);
  }

  async saveProfile() {
    // Validation
    if (!this.nama || this.nama.trim() === '') {
      this.showToast('Nama wajib diisi', 'warning');
      return;
    }

    // Check if name has changed
    if (this.buyer && this.nama === this.buyer.nama) {
      this.showToast('Tidak ada perubahan pada profil', 'warning');
      return;
    }

    this.isSaving = true;
    this.buyerService.updateBuyerProfile({ nama: this.nama.trim() }).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          this.showToast('Profil berhasil diupdate', 'success');
          setTimeout(() => {
            this.router.navigate(['/buyer/profile']);
          }, 500);
        }
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error updating profile:', error);
        const errorMessage = error.error?.message || 'Gagal mengupdate profil';
        this.showToast(errorMessage, 'danger');
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
