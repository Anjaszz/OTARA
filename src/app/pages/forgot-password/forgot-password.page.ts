import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class ForgotPasswordPage implements OnInit {
  email: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async sendOTP() {
    if (!this.email) {
      await this.showToast('Mohon masukkan email Anda', 'warning');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showToast('Format email tidak valid', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.success) {
          await this.showToast(response.message || 'Kode OTP telah dikirim ke email Anda', 'success');
          // Navigate to verify-otp page with email parameter
          this.router.navigate(['/verify-otp'], {
            queryParams: { email: this.email }
          });
        }
      },
      error: async (error) => {
        this.isLoading = false;
        const message = error.message || 'Gagal mengirim kode OTP. Silakan coba lagi.';
        await this.showToast(message, 'danger');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/masuk']);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
