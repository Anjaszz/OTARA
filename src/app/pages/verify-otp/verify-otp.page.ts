import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, ToastController } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, CommonModule, FormsModule]
})
export class VerifyOtpPage implements OnInit, OnDestroy {
  @ViewChildren('input0, input1, input2, input3') inputs!: QueryList<ElementRef>;

  email: string = '';
  otpDigits: string[] = ['', '', '', ''];
  isLoading: boolean = false;
  isResending: boolean = false;
  countdown: number = 60;
  private countdownInterval: any;

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

    // Start countdown timer
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  onOtpInput(event: any, index: number) {
    const value = event.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      this.otpDigits[index] = '';
      return;
    }

    // Move to next input if value is entered
    if (value && index < 3) {
      const inputArray = this.inputs.toArray();
      inputArray[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const inputArray = this.inputs.toArray();
      inputArray[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 4);

    digits.forEach((digit, index) => {
      if (index < 4) {
        this.otpDigits[index] = digit;
      }
    });

    // Focus on the last filled input or first empty one
    const inputArray = this.inputs.toArray();
    const nextIndex = Math.min(digits.length, 3);
    inputArray[nextIndex].nativeElement.focus();
  }

  isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  getOtpValue(): string {
    return this.otpDigits.join('');
  }

  async verifyOTP() {
    const otp = this.getOtpValue();

    if (!otp || otp.length !== 4) {
      await this.showToast('Mohon masukkan kode OTP lengkap', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.verifyOTP(this.email, otp).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.success) {
          await this.showToast(response.message || 'Verifikasi berhasil', 'success');
          // Navigate to reset-password page with email parameter
          this.router.navigate(['/reset-password'], {
            queryParams: { email: this.email }
          });
        }
      },
      error: async (error) => {
        this.isLoading = false;
        const message = error.message || 'Kode OTP tidak valid. Silakan coba lagi.';
        await this.showToast(message, 'danger');
        // Clear OTP on error
        this.otpDigits = ['', '', '', ''];
        const inputArray = this.inputs.toArray();
        inputArray[0].nativeElement.focus();
      }
    });
  }

  async resendOTP() {
    if (this.countdown > 0) {
      return;
    }

    this.isResending = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: async (response) => {
        this.isResending = false;
        if (response.success) {
          await this.showToast('Kode OTP baru telah dikirim', 'success');
          this.otpDigits = ['', '', '', '']; // Clear OTP inputs
          this.startCountdown(); // Restart countdown
          const inputArray = this.inputs.toArray();
          inputArray[0].nativeElement.focus();
        }
      },
      error: async (error) => {
        this.isResending = false;
        const message = error.message || 'Gagal mengirim ulang kode OTP. Silakan coba lagi.';
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
