import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, ToastController } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class ResetPasswordPage implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      if (!this.email) {
        this.showToast('Email tidak ditemukan. Silakan coba lagi.', 'danger');
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async resetPassword() {
    if (!this.newPassword) {
      await this.showToast('Mohon masukkan password baru', 'warning');
      return;
    }

    if (this.newPassword.length < 6) {
      await this.showToast('Password minimal 6 karakter', 'warning');
      return;
    }

    if (!this.confirmPassword) {
      await this.showToast('Mohon konfirmasi password baru', 'warning');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      await this.showToast('Password tidak sama', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.success) {
          await this.showToast(response.message || 'Password berhasil direset. Silakan login dengan password baru.', 'success');
          // Navigate to login page
          this.router.navigate(['/masuk']);
        }
      },
      error: async (error) => {
        this.isLoading = false;
        const message = error.message || 'Gagal reset password. Silakan coba lagi.';
        await this.showToast(message, 'danger');
      }
    });
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
